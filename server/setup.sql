-- Sample PostgreSQL setup for CipherSQL Studio

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    age INTEGER
);

-- Insert sample data
INSERT INTO users (name, email, age) VALUES
('Alice Johnson', 'alice@example.com', 25),
('Bob Smith', 'bob@example.com', 30),
('Charlie Brown', 'charlie@example.com', 22),
('Diana Prince', 'diana@example.com', 28),
('Eve Wilson', 'eve@example.com', 35);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL
);

INSERT INTO customers (customer_name) VALUES
('John Doe'),
('Jane Smith'),
('Mike Johnson');

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    product VARCHAR(100),
    amount DECIMAL(10,2)
);

INSERT INTO orders (customer_id, product, amount) VALUES
(1, 'Laptop', 999.99),
(2, 'Phone', 599.99),
(1, 'Mouse', 29.99),
(3, 'Keyboard', 79.99);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50),
    product VARCHAR(100),
    amount DECIMAL(10,2)
);

INSERT INTO sales (category, product, amount) VALUES
('Electronics', 'Laptop', 999.99),
('Electronics', 'Phone', 599.99),
('Furniture', 'Chair', 149.99),
('Furniture', 'Desk', 299.99),
('Electronics', 'Tablet', 399.99);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    employee_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    department_id INTEGER,
    salary DECIMAL(10,2)
);

INSERT INTO employees (name, department_id, salary) VALUES
('Alice', 1, 70000),
('Bob', 1, 60000),
('Charlie', 2, 80000),
('Diana', 2, 90000),
('Eve', 1, 65000);
