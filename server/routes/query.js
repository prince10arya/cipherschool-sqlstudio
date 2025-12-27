/**
 * SQL Query Execution Route with Multi-Layer Security
 * 
 * This module handles SQL query execution with comprehensive security measures:
 * - AST-based query validation
 * - Command type whitelisting (SELECT only)
 * - Table name whitelisting
 * - Transaction-based rollback for read-only operations
 * 
 * @module routes/query
 */

const express = require('express');
const router = express.Router();
const { pgPool } = require('../config/db');
const { parse } = require('pgsql-parser');

/**
 * Whitelist of tables that users are allowed to query
 * Add new table names here to grant access
 */
const ALLOWED_TABLES = [
    'users',
    'customers',
    'orders',
    'sales',
    'employees',
    'products',
    'departments'
];

/**
 * Whitelist of SQL commands permitted for execution
 * Currently restricted to SELECT statements only for security
 */
const ALLOWED_COMMANDS = [
    'SelectStmt' // Only SELECT queries are allowed
];

/**
 * Validates SQL query structure using Abstract Syntax Tree (AST) parsing
 * This provides syntax-level validation before query execution
 * 
 * @param {string} query - The SQL query to validate
 * @returns {Object} Validation result with 'valid' boolean and optional 'error' message
 */
function validateQueryStructure(query) {
    // 1. Configuration
    const ALLOWED_COMMANDS = ['select'];

    try {
        console.log('🔍 Starting validation for query...');

        if (!query || query.trim().length === 0) {
            console.warn('⚠️ Validation failed: Query is empty.');
            return { valid: false, error: 'Query cannot be empty.' };
        }

        // 2. Parse the SQL into an AST
        // This confirms the query is syntactically correct for Postgres
        const statements = parse(query);
        console.log(`✅ Syntax Check Passed: Found ${statements.length} statement(s).`);

        // 3. Iterate through each statement to verify intent
        for (let i = 0; i < statements.length; i++) {
            const stmt = statements[i];
            const stmtType = stmt.type?.toLowerCase();

            console.log(`🧐 Analyzing statement [${i + 1}]: Type identified as "${stmtType}"`);

            // Security Check: Block disallowed commands
            if (!ALLOWED_COMMANDS.includes(stmtType)) {
                console.error(`❌ Security Violation: Command "${stmtType}" is not permitted.`);
                return {
                    valid: false,
                    error: `Forbidden command: ${stmtType?.toUpperCase()}. Only SELECT queries are allowed.`
                };
            }
            console.log(`✅ Statement [${i + 1}]: Command type "${stmtType}" is authorized.`);

            // Security Check: Prevent "SELECT INTO" (which modifies the DB schema)
            if (stmtType === 'select' && stmt.into) {
                console.error(`❌ Security Violation: "SELECT INTO" detected.`);
                return {
                    valid: false,
                    error: 'Structure "SELECT INTO" is forbidden. Use standard SELECT for data retrieval.'
                };
            }
            console.log(`✅ Statement [${i + 1}]: No forbidden sub-clauses (e.g., INTO) detected.`);
        }

        // 4. Final Success
        console.log('🚀 Query Validation Complete: All checks passed. Query is safe to proceed.');
        return {
            valid: true,
            ast: statements,
            count: statements.length
        };

    } catch (error) {
        // 5. Catch Syntax Errors (e.g., mismatched quotes, invalid keywords)
        console.error('❌ Syntax Error detected by Parser:', error.message);
        return {
            valid: false,
            error: `PostgreSQL Syntax Error: ${error.message}`
        };
    }
}

/**
 * Recursively extracts all table names referenced in a query's AST
 * This helps identify which tables the query is trying to access
 * 
 * @param {Array} ast - The Abstract Syntax Tree array from pgsql-parser
 * @returns {Array<string>} Array of unique table names found in the query
 */
function extractTableNames(ast) {
    console.log('🔍 Extracting table names from AST...');
    const tables = new Set(); // Use Set to avoid duplicates

    /**
     * Recursive function to traverse the AST and find table references
     * @param {Object|Array} node - Current node in the AST
     */
    function traverse(node) {
        // Base case: ignore null, undefined, or non-object values
        if (!node || typeof node !== 'object') return;

        // Check if this node represents a table reference
        if (node.RangeVar && node.RangeVar.relname) {
            const tableName = node.RangeVar.relname.toLowerCase();
            console.log('📊 Found table reference:', tableName);
            tables.add(tableName);
        }

        // Recursively check all properties of the current node
        for (const key in node) {
            if (node.hasOwnProperty(key)) {
                if (Array.isArray(node[key])) {
                    // Traverse each item in arrays
                    node[key].forEach(item => traverse(item));
                } else if (typeof node[key] === 'object') {
                    // Traverse nested objects
                    traverse(node[key]);
                }
            }
        }
    }

    traverse(ast);
    const tableList = Array.from(tables);
    console.log('✅ Extracted tables:', tableList);
    return tableList;
}

/**
 * Validates that all table names in a query are on the allowed whitelist
 * This prevents unauthorized access to sensitive database tables
 * 
 * @param {Array<string>} tableNames - Array of table names to validate
 * @returns {Object} Validation result with 'valid' boolean and optional 'error' message
 */
function validateTableNames(tableNames) {
    console.log('🔍 Validating table names against whitelist...');
    console.log('📋 Tables to validate:', tableNames);
    console.log('✅ Allowed tables:', ALLOWED_TABLES);

    // Find any tables that are NOT on the whitelist
    const invalidTables = tableNames.filter(
        table => !ALLOWED_TABLES.includes(table.toLowerCase())
    );

    // If any unauthorized tables were found, reject the query
    if (invalidTables.length > 0) {
        console.log('❌ Unauthorized tables found:', invalidTables);
        return {
            valid: false,
            error: `Unauthorized table access: ${invalidTables.join(', ')}. 
You can only query these tables: ${ALLOWED_TABLES.join(', ')}`
        };
    }

    // All tables are authorized
    console.log('✅ All tables are authorized');
    return { valid: true };
}

/**
 * POST /api/query/execute
 * 
 * Executes a user-submitted SQL query with comprehensive security validation.
 * The query is validated through multiple security layers before execution.
 * All queries are executed within a transaction that is rolled back to ensure
 * read-only operation and prevent any database modifications.
 * 
 * Security Layers:
 * 1. Input validation (non-empty string)
 * 2. AST-based structure validation
 * 3. Command type whitelisting (SELECT only)
 * 4. Table name whitelisting
 * 5. Transaction-based rollback
 * 
 * @route POST /api/query/execute
 * @param {string} req.body.query - The SQL query to execute
 * @returns {Object} JSON response with query results or error message
 */
router.post('/execute', async (req, res) => {
    console.log('\n🚀 ===== New Query Execution Request =====');

    // Get a database client from the connection pool
    const client = await pgPool.connect();

    try {
        const { query } = req.body;
        console.log('📝 Received query:', query);

        // ===== SECURITY LAYER 1: Basic Input Validation =====
        console.log('\n🛡️ LAYER 1: Basic Input Validation');
        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            console.log('❌ Invalid input');
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid SQL query',
            });
        }
        console.log('✅ Input validation passed');

        // ===== SECURITY LAYER 2: AST-Based Structure Validation =====
        console.log('\n🛡️ LAYER 2: AST Structure Validation');
        const structureValidation = validateQueryStructure(query);
        if (!structureValidation.valid) {
            console.log('❌ Structure validation failed');
            return res.status(400).json({
                success: false,
                message: structureValidation.error,
            });
        }
        console.log('✅ Structure validation passed');

        // ===== SECURITY LAYER 3: Table Name Whitelisting =====
        console.log('\n🛡️ LAYER 3: Table Whitelisting');
        const tableNames = extractTableNames(structureValidation.ast);
        const tableValidation = validateTableNames(tableNames);
        if (!tableValidation.valid) {
            console.log('❌ Table validation failed');
            return res.status(403).json({
                success: false,
                message: tableValidation.error,
            });
        }
        console.log('✅ Table validation passed');

        // ===== SECURITY LAYER 4: Execute in Read-Only Transaction =====
        console.log('\n🛡️ LAYER 4: Transaction Execution');
        // Start a transaction
        await client.query('BEGIN');
        console.log('📌 Transaction started');

        try {
            // Execute the validated query
            console.log('⚙️ Executing query...');
            const result = await client.query(query);
            console.log(`✅ Query executed successfully - ${result.rowCount} rows returned`);

            // Always rollback to ensure no modifications are made
            // This makes all queries read-only regardless of their content
            await client.query('ROLLBACK');
            console.log('🔄 Transaction rolled back (read-only mode)');

            console.log('✅ ===== Request Completed Successfully =====\n');

            // Return the query results to the user
            res.json({
                success: true,
                data: {
                    rows: result.rows,
                    rowCount: result.rowCount,
                    fields: result.fields.map((field) => ({
                        name: field.name,
                        dataType: field.dataTypeID,
                    })),
                },
            });
        } catch (execError) {
            // If query execution fails, rollback the transaction
            await client.query('ROLLBACK');
            console.error('❌ Query execution error:', execError.message);
            throw execError;
        }
    } catch (error) {
        // Log the error for debugging
        console.error('❌ Request failed:', error.message);
        console.log('❌ ===== Request Failed =====\n');

        // Send a user-friendly error message
        res.status(400).json({
            success: false,
            message: error.message || 'Your query could not be executed. Please check the syntax and try again.',
        });
    } finally {
        // Always release the database client back to the pool
        client.release();
        console.log('🔓 Database client released');
    }
});

module.exports = router;
