CREATE DATABASE mini_crm;

USE mini_crm;

CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO admin (username, password)
VALUES ('admin', 'admin123');

CREATE TABLE leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    source VARCHAR(100),
    status VARCHAR(20) DEFAULT 'New',
    notes Text,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);