const express = require('express')
const router = express.Router()

//Todos los directores
router.get('/', (req, res) => {
  res.render('directores/index')
})

//Nueva ruta director
router.get('/nuevo', (req, res) => {
  res.render('directores/nuevo')
})

//Crear ruta director

router.post('/', (req, res) => {
  res.render('create')
})

module.exports = router