const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Pelicula = require('../models/pelicula')
const Director = require('../models/director')
const uploadPath = path.join('public', Pelicula.coverBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

//Ruta para todas las peliculas
router.get('/', async (req, res) => {
  let query = Pelicula.find()
  if (req.query.name != null && req.query.name != '') {
    query = query.regex('name', new RegExp(req.query.name, 'i'))
  }
  if (req.query.premieredBefore != null && req.query.premieredBefore != '') {
    query = query.lte('premierDate', req.query.premieredBefore)
  }
  if (req.query.premieredAfter != null && req.query.premieredAfter != '') {
    query = query.gte('premierDate', req.query.premieredAfter)
  }
  try {
    const peliculas = await query.exec()
    res.render('peliculas/index', {
        peliculas: peliculas,
        searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

//Ruta para crear una nueva pelicua
router.get('/nueva', async (req, res) => {
  renderNewPage(res, new Pelicula())
})

// Crear una ruta para cada pelicula
router.post('/', upload.single('cover'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const pelicula = new Pelicula({
    name: req.body.name,
    director: req.body.director,
    premierDate: new Date(req.body.premierDate),
    duration: req.body.duration,
    coverImageName: fileName,
    synopsis: req.body.synopsis
  })

  try {
    const newPelicula = await pelicula.save()
    res.redirect(`peliculas`)
  } catch {
    if (pelicula.coverImageName != null) {
      removeCover(pelicula.coverImageName)
    }
    renderNewPage(res, pelicula, true)
  }
})

function removeCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.error(err)
  })
}

async function renderNewPage(res, pelicula, hasError = false) {
  try {
    const directores = await Director.find({})
    const params = {
      directores: directores,
      pelicula: pelicula
    }
    if (hasError) params.errorMessage = 'Error al crear la pelicula'
    res.render('peliculas/nueva', params)
  } catch {
    res.redirect('/peliculas')
  }
}

module.exports = router