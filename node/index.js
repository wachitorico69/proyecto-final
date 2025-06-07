require('dotenv').config()
const express = require('express')
const paypal = require('./services/paypal')
const app = express()
const cors = require('cors');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin'); //QR
let correoCompra = null;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:4200'
}));

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/pay', async (req, res) => {
    const { correo } = req.body;
    correoCompra = correo;

    try {
        const url = await paypal.createOrder();

        res.json({ url });

    } catch (error) {
        console.error('Error en /pay:', error);
        res.status(500).json({ error: 'Error al enviar correo o crear orden' });
    }
});

app.get('/complete-order', async (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS  
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: correoCompra,
        subject: 'Gracias por comprar en Gorilla Gym!',
        text: 'Gracias por tu transacción reciente en Gorilla Gym.\nCurso Online\nTotal: Mex$ 500.00'
    };

    try {
        const orderId = req.query.token;
        await paypal.capturePayment(orderId);
        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a ${correoCompra}`);
        res.redirect('http://localhost:4200/home');
    } catch (error) {
        console.error(error.response?.data || error);
        res.send('Error ' + error);
    }
});


app.get('/cancel-order', (req, res) => {
    res.redirect('http://localhost:4200/clases');
})


// Inicializa Firebase Admin con tu archivo de credenciales --QR
admin.initializeApp({
  credential: admin.credential.cert(require('./config/firebase-key.json'))
});
const db = admin.firestore(); //QR


// Endpoint que devuelve datos de un usuario (por ejemplo) para el QR
app.get('/api/usuario/:id', async (req, res) => {
  try {
    const doc = await db.collection('usuarios').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    // Envía solo los datos que quieres que el QR contenga
    const data = doc.data();
    res.json({
        id: doc.id,
        nombre: data.nombre,
        email: data.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/usuarios', async (req, res) => {
  try {
    const usuariosSnapshot = await db.collection('usuarios').get();
    const usuarios = [];
    usuariosSnapshot.forEach(doc => {
      usuarios.push({
        id: doc.id,
        ...doc.data()
      });
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(3000, () => console.log('Server iniciado en el puerto 3000'))