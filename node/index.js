require('dotenv').config()
const express = require('express')
const paypal = require('./services/paypal')
const app = express()
const cors = require('cors');
const nodemailer = require('nodemailer');
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

app.listen(3000, () => console.log('Server iniciado en el puerto 3000'))