-- Create a database called 'Bamazon'
CREATE DATABASE bamazon;
USE bamazon;

-- Create a table called 'products' which will contain the store inventory --
CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30) NOT NULL,
	department_name VARCHAR(20) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INTEGER(11) NOT NULL,
	PRIMARY KEY (item_id)
);

-- Insert data into the 'products' table --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES  ('Orbea Occam Mountain Bike', 'Sporting & Outdoors',        1200.00, 30),
		('Go Pro Hero 7', 'Electronics', 425.00, 627),	
		('Coleman Campstove', 'Sporting & Outdoors', 89.95, 432),
        ('Instinct Chicken Dog Food', 'Pet Supplies',56.95, 600);

