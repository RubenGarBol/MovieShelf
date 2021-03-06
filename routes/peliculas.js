const express = require('express')
const router = express.Router()
const Pelicula = require('../models/pelicula')
const Director = require('../models/director')
const director = require('../models/director')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
/*
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})*/

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

//Ruta para crear una nueva pelicula
router.get('/nueva', async (req, res) => {
  renderNewPage(res, new Pelicula())
})

// Crear una ruta para cada pelicula
router.post('/', async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const pelicula = new Pelicula({
    name: req.body.name,
    director: req.body.director,
    premierDate: new Date(req.body.premierDate),
    duration: req.body.duration,
    coverImageName: fileName,
    synopsis: req.body.synopsis
  })
  
  if (req.body.cover != null && req.body.cover !== '') {
    saveCover(pelicula, req.body.cover)
  }
  
  try {
    const newPelicula = await pelicula.save()
    res.redirect(`peliculas`)
  } catch (err){
    console.log(err)
    if (pelicula.coverImageName != null) {
      removeCover(pelicula.coverImageName)
    }
    renderNewPage(res, pelicula, true)
  }
})

//Ruta para mostrar cada pelicula
router.get('/:id', async (req, res) => {
  try {
    const pelicula = await Pelicula.findById(req.params.id).populate('director').exec()
    res.render('peliculas/mostrar', { 
      pelicula: pelicula,
    })
  } catch {
    res.redirect('/')
  }
})

//Ruta para editar cada pelicula
router.get('/:id/editar', async (req, res) => {
  try {
    const pelicula = await Pelicula.findById(req.params.id)
    renderEditPage(res, pelicula)
  } catch(err) {
    console.log(err)
    res.redirect('/')
  }
})

//Ruta para actualizar las peliculas
router.put('/:id', async (req, res) => {
  let pelicula
  try {
    pelicula = await Pelicula.findById(req.params.id)
    pelicula.name = req.body.name
    pelicula.director = req.body.director
    pelicula.premierDate = new Date(req.body.premierDate)
    pelicula.duration = req.body.duration
    pelicula.synopsis = req.body.synopsis

    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(pelicula, req.body.cover)
    }
    await pelicula.save()
    res.redirect(`/peliculas/${pelicula.id}`)
  } catch {
    if (pelicula != null) {
      renderEditPage(res, pelicula, true)
    } else {
      redirect('/')
    }
  }
})

//Ruta para borrar cada pelicula
router.delete('/:id', async (req, res) => {
  let pelicula
  try {
    pelicula = await Pelicula.findById(req.params.id)
    await pelicula.remove()
    res.redirect('/peliculas')
  } catch {
    if (pelicula != null) {
      res.render('peliculas/mostrar', {
        pelicula: pelicula,
        errorMsg: 'No se pudo borrar la pelicula'
      })
    } else {
      res.redirect('/')
    }
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
    if (hasError) params.errorMsg = 'Error al crear la pelicula'
    res.render('peliculas/nueva', params)
  } catch {
    res.redirect('/peliculas')
  }
}

async function renderEditPage(res, pelicula, hasError = false) {
  try {
    const directores = await Director.find({})
    const params = {
      directores: directores,
      pelicula: pelicula
    }
    if (hasError) {
        params.errorMsg = 'Error al editar el libro'
    }
    res.render(`peliculas/editar`, params)
  } catch (err) {
    res.redirect('/peliculas')
  }
}


function saveCover(pelicula, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    pelicula.coverImage = new Buffer.from(cover.data, 'base64')
    pelicula.coverImageType = cover.type
  }
}

module.exports = router