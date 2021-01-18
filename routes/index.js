const express = require('express')
const router = express.Router()
const Pelicula = require('../models/pelicula')

router.get('/', async (req, res) => {
  let peliculas
  try {
    peliculas = await Pelicula.find().sort({ creationDate: 'desc' }).limit(10).exec()
  } catch {
    peliculas = []
  }
  res.render('index', { peliculas: peliculas })
})

module.exports = router