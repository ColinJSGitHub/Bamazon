-- The base SQL table you will need to use to run the javascript files.
CREATE database `bamazon`;

USE `bamazon`;

CREATE TABLE `products` (
  `item_id` INT NOT NULL AUTO_INCREMENT,
  `product_name` VARCHAR(100) NULL,
  `department_name` VARCHAR(100) NULL,
  `price` INT(10),
  `stock_quantity` INT(10) NULL,
  `product_sales` INT(10),
  PRIMARY KEY (`item_id`)
);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)

VALUES ('Kayak', 'Outdoors', 600, 25, 0),
('Bicycle', 'Outdoors', 250, 50, 0),
('Laptop', 'Electronics', 1000, 10, 0),
('Lego Set', 'Toys', 50, 100, 0),
('Giraffe', 'Pets', 20000, 1, 0),
('Headphones', 'Electronics', 75, 20, 0),
('Swimsuit', 'Clothing', 40, 200, 0),
('Puppy', 'Pets', 2500, 8, 0),
('Levi Jeans', 'Clothing', 70, 15, 0),
('Jenga', 'Toys', 25, 40, 0);

CREATE TABLE `departments` (
  `department_id` INT NOT NULL AUTO_INCREMENT,
  `department_name` VARCHAR(100) NULL,
  `over_head_costs` INT(10),
  `total_sales` INT(10),
  `total_profits` INT(10),
  PRIMARY KEY (`department_id`)
);

--  Note- total_profits before any sales is equal to the negative of the overheadcosts. No sales, you're in the hole.
INSERT INTO departments (department_name, over_head_costs, total_sales, total_profits)

VALUES ('Outdoors', 2500, 0, -2500),
('Electronics', 5000, 0, -5000),
('Toys', 2000, 0, -2000),
('Pets', 7000, 0, -7000),
('Clothing', 3000, 0, -3000);