require('dotenv').config()
const express = require('express')
const paypal = require('./services/paypal')

const app = express()

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:4200'
}));

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/pay', async(req, res) => {
    try {
        const url = await paypal.createOrder()

        res.json({url})
    } catch (error) {
        res.send('Error'  + error)
    }
})

app.get('/complete-order', async (req, res) => {
    try {
        const orderId = req.query.token;
        await paypal.capturePayment(orderId);
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