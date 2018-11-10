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
VALUES  ('Orbea Occam Mountain Bike', 'Sporting & Outdoors',1200.00, 30),
		('Go Pro Hero 7', 'Electronics',425.00, 627),	
		('Coleman Campstove', 'Sporting & Outdoors',89.95, 432),
        ('Instinct Chicken Dog Food', 'Pet Supplies',56.95, 600),
        ('Honeydew Melon', 'Grocery',3.25, 80),
        ('Kraft Macaroni & Cheese', 'Grocery',2.25, 115),
        ('Helio Outdoor Shower', 'Sporting & Outdoors',89.95, 57),
        ('Sony Playstation Console', 'Electronics',299.95, 150),
        ('Gala Apples', 'Grocery',3.95, 495),
        ('Dove Bar soap', 'Hygiene',1.99, 450);

-- Set the password to the localhost --
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
