require('dotenv').config()
const express = require('express')
const paypal = require('./services/paypal')

const app = express()

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(3000, () => console.log('Server iniciado en el puerto 3000'))