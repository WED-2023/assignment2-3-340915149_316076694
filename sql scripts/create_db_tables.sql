CREATE DATABASE hiketsu 
  DEFAULT CHARACTER SET = 'utf8mb4';
USE hiketsu;


CREATE TABLE users (  
  user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  country VARCHAR(50) NOT NULL,
  password VARCHAR(100) NOT NULL,
  email VARCHAR(50) NOT NULL
);


CREATE TABLE favorites (  
  user_id INT NOT NULL,
  recipe_id INT NOT NULL,
  PRIMARY KEY(recipe_id, user_id),
  FOREIGN KEY(user_id) REFERENCES users(user_id)
);



CREATE TABLE recipes (
  recipe_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  readyInMinutes INT NOT NULL,
  vegetarian BOOLEAN NOT NULL,
  vegan BOOLEAN NOT NULL,
  glutenFree BOOLEAN NOT NULL,
  servings INT NOT NULL,
  instructions JSON NOT NULL,
  ingredients JSON NOT NULL,
  image VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE family_recipes (
  recipe_id INT NOT NULL AUTO_INCREMENT  PRIMARY KEY,
  user_id INT NOT NULL,
  owner VARCHAR(100) NOT NULL,
  whenToPrepare VARCHAR(100) NOT NULL,
  title VARCHAR(150) NOT NULL,
  readyInMinutes INT NOT NULL,
  vegetarian BOOLEAN NOT NULL,
  vegan BOOLEAN NOT NULL,
  glutenFree BOOLEAN NOT NULL,
  image VARCHAR(255) NOT NULL,
  instructions JSON NOT NULL,
  ingredients JSON NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);