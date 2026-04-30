const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /usuarios - listar
router.get('/', async (req, res) => {
  try {
    const pool = db.getPool();
    const [rows] = await pool.query('SELECT * FROM usuarios ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('GET /usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// GET /usuarios/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const pool = db.getPool();
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('GET /usuarios/:id:', err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// POST /usuarios
router.post('/', async (req, res) => {
  const { nombre, apellido, telefono, ciudad, cumpleanos, avatar } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El campo nombre es obligatorio' });
  }

  try {
    const pool = db.getPool();

    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre, apellido, telefono, ciudad, cumpleanos, avatar)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        apellido || null,
        telefono || null,
        ciudad || null,
        cumpleanos || null,
        avatar || null
      ]
    );

    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /usuarios:', err);
    res.status(500).json({ error: 'Error al insertar usuario' });
  }
});

// PUT /usuarios/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, telefono, ciudad, cumpleanos, avatar } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El campo nombre es obligatorio' });
  }

  try {
    const pool = db.getPool();

    const [result] = await pool.query(
      `UPDATE usuarios 
       SET nombre = ?, apellido = ?, telefono = ?, ciudad = ?, cumpleanos = ?, avatar = ?
       WHERE id = ?`,
      [
        nombre,
        apellido || null,
        telefono || null,
        ciudad || null,
        cumpleanos || null,
        avatar || null,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE id = ?',
      [id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error('PUT /usuarios/:id:', err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// DELETE /usuarios/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const pool = db.getPool();

    const [result] = await pool.query(
      'DELETE FROM usuarios WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ success: true, deletedId: Number(id) });
  } catch (err) {
    console.error('DELETE /usuarios/:id:', err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;