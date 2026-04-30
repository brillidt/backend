const mysql = require('mysql2/promise');

// Variables de entorno Railway + desarrollo local
const DB_HOST = process.env.MYSQLHOST || process.env.DB_HOST || 'localhost';
const DB_USER = process.env.MYSQLUSER || process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '';
const DB_NAME = process.env.MYSQLDATABASE || process.env.DB_NAME || 'mi_db';
const DB_PORT = process.env.MYSQLPORT
  ? Number(process.env.MYSQLPORT)
  : (process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306);

let pool;

async function initDb() {
  // Railway normalmente ya crea la DB
  // En local sí puede necesitar crearla
  try {
    const adminConnection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT
    });

    await adminConnection.query(`
      CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci
    `);

    await adminConnection.end();
  } catch (error) {
    console.log('La base de datos ya existe o Railway la administra automáticamente');
  }

  pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Crear tabla si no existe
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      apellido VARCHAR(255),
      telefono VARCHAR(20),
      ciudad VARCHAR(255),
      cumpleanos DATE,
      avatar LONGTEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insertar datos solo si la tabla está vacía
  const [rows] = await pool.query('SELECT COUNT(*) as total FROM usuarios');

  if (rows[0].total === 0) {
    await pool.query(`
      INSERT INTO usuarios (nombre, apellido, telefono, ciudad, cumpleanos, avatar) VALUES
      ('Ana', 'García', '0213352739', 'Madrid', '2023-05-14', 'https://i.pravatar.cc/150?img=1'),
      ('Sofia', 'Pérez', '0218357783', 'Barcelona', '2023-04-06', 'https://i.pravatar.cc/150?img=2'),
      ('Laura', 'Rodriguez', '0213352738', 'Valencia', '2023-06-25', 'https://i.pravatar.cc/150?img=3'),
      ('Eonna', 'Solfia', '0218357730', 'Sevilla', '2023-04-20', 'https://i.pravatar.cc/150?img=4'),
      ('Lunna', 'García', '0213353773', 'Bilbao', '2023-05-26', 'https://i.pravatar.cc/150?img=5')
    `);
  }

  console.log('Base de datos conectada correctamente');
  return pool;
}

function getPool() {
  if (!pool) {
    throw new Error('La base de datos no ha sido inicializada todavía');
  }
  return pool;
}

module.exports = {
  initDb,
  getPool
};