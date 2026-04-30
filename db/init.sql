-- Crear base de datos y tabla de ejemplo
CREATE DATABASE IF NOT EXISTS mi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mi_db;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255),
  telefono VARCHAR(20),
  ciudad VARCHAR(255),
  cumpleanos DATE,
  avatar LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nombre, apellido, telefono, ciudad, cumpleanos, avatar) VALUES 
('Ana', 'García', '021 3352739', 'Madrid', '2023-05-14', 'https://i.pravatar.cc/150?img=1'),
('Sofia', 'Pérez', '021 8357783', 'Barcelona', '2023-04-06', 'https://i.pravatar.cc/150?img=2'),
('Laura', 'Rodriguez', '021 3352739', 'Valencia', '2023-06-25', 'https://i.pravatar.cc/150?img=3'),
('Eonna', 'Solfia', '021 8357730', 'Seville', '2023-04-20', 'https://i.pravatar.cc/150?img=4'),
('Lunna', 'García', '021 3353773', 'Bilbao', '2023-05-26', 'https://i.pravatar.cc/150?img=5');
