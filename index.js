require('dotenv').config();
const express = require('express');
const cors = require('cors');
const usuariosRouter = require('./routes/usuarios');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/usuarios', usuariosRouter);

app.get('/', (req, res) => {
  res.json({ message: 'API funcionando' });
});

async function startServer() {
  try {
    await db.initDb();
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err.message || err);
    process.exit(1);
  }
}

startServer();
