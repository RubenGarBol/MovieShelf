const express = require('express')
const router = express.Router()
const Director = require('../models/director')

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

//Ruta director creado
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
      //res.redirect(`director/${newDirector.id}`)
      res.redirect(`directores`)
    }
    })*/
  //res.send(req.body.name)
})

module.exports = router