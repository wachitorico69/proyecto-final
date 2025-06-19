const express = require('express');
const router = express.Router();
const paypal = require('../services/paypal');
const nodemailer = require('nodemailer');

let correoCompra = null;

router.post('/pay', async (req, res) => {
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

router.get('/complete-order', async (req, res) => {
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
    res.redirect('https://proyecto-final-node-y03d.onrender.com/home');
  } catch (error) {
    console.error(error.response?.data || error);
    res.send('Error ' + error);
  }
});

router.get('/cancel-order', (req, res) => {
  res.redirect('https://proyecto-final-node-y03d.onrender.com/clases');
});

module.exports = router;