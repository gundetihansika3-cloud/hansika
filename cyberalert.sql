-- Create database
CREATE DATABASE IF NOT EXISTS cyberalert;
USE cyberalert;

-- Users table for auth
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  officer_id VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test admin user (password: 'password123')
INSERT INTO users (name, email, officer_id, password_hash, role) VALUES 
('Admin User', 'admin@cyberalert.gov.in', 'OFF001', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON DUPLICATE KEY UPDATE name=name;

-- Sample fraud reports table (for future)
CREATE TABLE IF NOT EXISTS fraud_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  type VARCHAR(100),
  description TEXT,
  evidence TEXT,
  status ENUM('pending', 'analyzing', 'blacklisted') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
