if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
<<<<<<< Updated upstream
const methodOverride = require('method-override')
=======
>>>>>>> Stashed changes

const indexRouter = require('./routes/index')
const directorRouter = require('./routes/directores')
const peliculaRouter = require('./routes/peliculas')

//Gestion vistas
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended:false }))

<<<<<<< Updated upstream
//Conexion BBDD
=======
app.use(bodyParser.urlencoded({ limit: '10mb', extended:false }))

//Gestion BBDD
>>>>>>> Stashed changes
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Conectado a Mongoose'))

app.use('/', indexRouter)
app.use('/directores', directorRouter)
app.use('/peliculas', peliculaRouter)

app.listen(process.env.PORT || 3000)