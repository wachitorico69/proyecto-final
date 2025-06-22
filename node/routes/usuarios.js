const express = require('express');
const router = express.Router();

// Endpoint que devuelve datos de un usuario (por ejemplo) para el QR
router.get('/usuario/:id', async (req, res) => {
  const db = req.app.get('db');

  try {
    const doc = await db.collection('usuarios').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Envía solo los datos que quieres que el QR contenga
    const data = doc.data();
    res.json({
      id: doc.id,
      nombre: data.nombre,
      email: data.correo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/usuarios', async (req, res) => {
  const db = req.app.get('db');

  try {
    const snapshot = await db.collection('usuarios').get();
    const usuarios = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;