CREATE DATABASE IF NOT EXISTS sifali_bitkiler_db;
USE sifali_bitkiler_db;

CREATE TABLE IF NOT EXISTS herbs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    scientific_name VARCHAR(100),
    description TEXT,
    benefits TEXT,
    usage_instructions TEXT,
    image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS diseases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS herb_disease_relations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    herb_id INT,
    disease_id INT,
    treatment_description TEXT,
    FOREIGN KEY (herb_id) REFERENCES herbs(id),
    FOREIGN KEY (disease_id) REFERENCES diseases(id)
); 