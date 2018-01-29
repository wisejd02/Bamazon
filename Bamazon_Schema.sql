DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;
-- create a Table inside of that database called products.
-- The products table should have each of the following columns:
-- item_id (unique id for each product)
-- product_name (Name of product)
-- department_name
-- price (cost to customer)
-- stock_quantity (how much of the product is available in stores)

CREATE TABLE `products` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` VARCHAR(100) NULL,
  `dept_name` VARCHAR(100) NULL,
  `price` FLOAT NULL,
  `stock_quantity` INT NULL, 
  `product_sales` float DEFAULT '0',
  PRIMARY KEY (`item_id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `departments` (
  `dept_id` int(11) NOT NULL AUTO_INCREMENT,
  `dept_name` VARCHAR(100) NULL,
  `overhead_cost` FLOAT NULL,
  PRIMARY KEY (`dept_id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

