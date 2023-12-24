CREATE DATABASE RecipeDB;
USE RecipeDB;

CREATE TABLE users(
id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
username VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL
);


CREATE TABLE favorite(
email VARCHAR(50) NOT NULL,
title VARCHAR(50) NOT NULL,
FOREIGN KEY (email) REFERENCES users(email) ON UPDATE CASCADE ON DELETE CASCADE,
PRIMARY KEY (email,title)
);

insert into favorite (email,title) values
('snsudeshnayak3@gmail.com','masala dosa');

select * from favorite;



