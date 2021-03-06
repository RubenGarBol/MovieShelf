const express = require('express')
const router = express.Router()
const Director = require('../models/director')
const Pelicula = require('../models/pelicula')

//Todos los directores
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const directores = await Director.find(searchOptions)
    res.render('directores/index', {
      directores: directores,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
  //res.render('directores/index')
})

//Ruta para crear nuevo director
router.get('/nuevo', (req, res) => {
  res.render('directores/nuevo', { director: new Director() })
})

//Crear ruta para nuevo director 
router.post('/', async (req, res) => {
  const director = new Director({
    name: req.body.name
  })
    try {
      const newDirector = await director.save()
      res.redirect(`directores`)
    } catch {
      res.render('directores/nuevo', {
        director: director,
        errorMsg: 'Error al crear el director'
      })
    }
    /*
    director.save((err, newDirector) =>{
    if(err){
      res.render('directores/nuevo', {
        director: director,
        errorMsg: 'Error al crear el director'
      })
    }else {
      res.redirect(`directores`)
    }
    })*/
  //res.send(req.body.name)
})

router.get('/:id', async (req, res) =>{
  try{
    const director = await Director.findById(req.params.id)
    const peliculas = await Pelicula.find({ director: director.id }).limit(6).exec()
    res.render('directores/mostrar', {
      director: director,
      peliculasDirigidas: peliculas
    })
  } catch(err) {
    console.log(err)
    res.redirect('/')
  }
})

router.get('/:id/editar', async (req, res) =>{
  try {
    const director = await Director.findById(req.params.id)
    res.render('directores/editar', { director: director })
  } catch {
    res.redirect('/directores')
  }
  //res.send('Editar Director ' + req.params.id)
})

router.put('/:id', async (req, res) =>{
  let director
  try {
    director = await Director.findById(req.params.id)
    director.name = req.body.name
    await director.save()
    res.redirect(`/directores/${director.id}`)
  } catch {
    if (director == null) {
      res.redirect('/')
    } else {
      res.render('directores/editar', {
        director: director,
        errorMsg: 'Error al actualizar el Director'
      })
    }
  }
  //res.send('Actualizar Director ' + req.params.id)
})

router.delete('/:id', async (req, res) =>{
  let director
  let searchOptions = {}
  const directores = await Director.find(searchOptions)
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    director = await Director.findById(req.params.id)
    
    await director.remove()
    res.redirect('/directores')
  } catch (err) {
    console.log(err)
    if (director == null) {
      res.redirect('/')
    } else {
      res.render('directores/index', {
        directores: directores,
        searchOptions: req.query,
        errorMsg: 'Error, el director tiene peliculas asignadas'
      })
    }
  }
  //res.send('Borrar Director ' + req.params.id)
})

module.exports = router