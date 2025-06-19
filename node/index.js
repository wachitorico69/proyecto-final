require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'https://gorillas-gym.web.app/' }));

// Inicializa Firebase Admin con tu archivo de credenciales --QR
admin.initializeApp({
  credential: admin.credential.cert(require('./config/firebase-key.json')),
});
const db = admin.firestore();
app.set('db', db); // Lo agregamos al app para que esté disponible en las rutas

// Rutas
app.use('/', require('./routes/paypal'));
app.use('/api', require('./routes/usuarios'));

// Levantar servidor
const PORT = 10000;
app.listen(PORT, () => console.log(`Server iniciado en el puerto ${PORT}`));