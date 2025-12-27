const sampleAssignments = [
    {
        title: 'Basic SELECT Query',
        difficulty: 'Easy',
        description: 'Learn to retrieve all data from a single table',
        question: 'Write a SQL query to retrieve all columns from the "users" table.',
        sampleData: {
            users: {
                schema: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'name', type: 'VARCHAR(100)' },
                    { name: 'email', type: 'VARCHAR(100)' },
                    { name: 'age', type: 'INTEGER' },
                ],
                rows: [
                    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', age: 25 },
                    { id: 2, name: 'Bob Smith', email: 'bob@example.com', age: 30 },
                    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', age: 22 },
                ],
            },
        },
    },
    {
        title: 'WHERE Clause Filtering',
        difficulty: 'Easy',
        description: 'Filter results using WHERE clause',
        question: 'Write a SQL query to find all users who are older than 25 years.',
        sampleData: {
            users: {
                schema: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'name', type: 'VARCHAR(100)' },
                    { name: 'email', type: 'VARCHAR(100)' },
                    { name: 'age', type: 'INTEGER' },
                ],
                rows: [
                    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', age: 25 },
                    { id: 2, name: 'Bob Smith', email: 'bob@example.com', age: 30 },
                    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', age: 22 },
                    { id: 4, name: 'Diana Prince', email: 'diana@example.com', age: 28 },
                ],
            },
        },
    },
    {
        title: 'JOIN Two Tables',
        difficulty: 'Medium',
        description: 'Combine data from multiple tables using JOIN',
        question: 'Write a SQL query to retrieve all orders along with the customer name who placed each order.',
        sampleData: {
            customers: {
                schema: [
                    { name: 'customer_id', type: 'INTEGER' },
                    { name: 'customer_name', type: 'VARCHAR(100)' },
                ],
                rows: [
                    { customer_id: 1, customer_name: 'John Doe' },
                    { customer_id: 2, customer_name: 'Jane Smith' },
                ],
            },
            orders: {
                schema: [
                    { name: 'order_id', type: 'INTEGER' },
                    { name: 'customer_id', type: 'INTEGER' },
                    { name: 'product', type: 'VARCHAR(100)' },
                    { name: 'amount', type: 'DECIMAL(10,2)' },
                ],
                rows: [
                    { order_id: 101, customer_id: 1, product: 'Laptop', amount: 999.99 },
                    { order_id: 102, customer_id: 2, product: 'Phone', amount: 599.99 },
                    { order_id: 103, customer_id: 1, product: 'Mouse', amount: 29.99 },
                ],
            },
        },
    },
    {
        title: 'GROUP BY and Aggregation',
        difficulty: 'Medium',
        description: 'Use aggregate functions with GROUP BY',
        question: 'Write a SQL query to find the total sales amount for each product category.',
        sampleData: {
            sales: {
                schema: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'category', type: 'VARCHAR(50)' },
                    { name: 'product', type: 'VARCHAR(100)' },
                    { name: 'amount', type: 'DECIMAL(10,2)' },
                ],
                rows: [
                    { id: 1, category: 'Electronics', product: 'Laptop', amount: 999.99 },
                    { id: 2, category: 'Electronics', product: 'Phone', amount: 599.99 },
                    { id: 3, category: 'Furniture', product: 'Chair', amount: 149.99 },
                    { id: 4, category: 'Furniture', product: 'Desk', amount: 299.99 },
                    { id: 5, category: 'Electronics', product: 'Tablet', amount: 399.99 },
                ],
            },
        },
    },
    {
        title: 'Subquery Challenge',
        difficulty: 'Hard',
        description: 'Use subqueries to solve complex problems',
        question: 'Write a SQL query to find all employees who earn more than the average salary in their department.',
        sampleData: {
            employees: {
                schema: [
                    { name: 'employee_id', type: 'INTEGER' },
                    { name: 'name', type: 'VARCHAR(100)' },
                    { name: 'department_id', type: 'INTEGER' },
                    { name: 'salary', type: 'DECIMAL(10,2)' },
                ],
                rows: [
                    { employee_id: 1, name: 'Alice', department_id: 1, salary: 70000 },
                    { employee_id: 2, name: 'Bob', department_id: 1, salary: 60000 },
                    { employee_id: 3, name: 'Charlie', department_id: 2, salary: 80000 },
                    { employee_id: 4, name: 'Diana', department_id: 2, salary: 90000 },
                    { employee_id: 5, name: 'Eve', department_id: 1, salary: 65000 },
                ],
            },
        },
    },

]

module.exports = sampleAssignments;