const mongoose = require('mongoose')
const Pelicula = require('./pelicula')

//"Tabla" director
const directorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

directorSchema.pre('remove', function(next) {
    Pelicula.find({ director: this.id }, (err, peliculas) => {
      if (err) {
        next(err)
      } else if (peliculas.length > 0) {
        next(new Error('El director tiene peliculas asignadas'))
      } else {
        next()
      }
    })
  })

//Nombre de la tabla y definicion de la misma
module.exports = mongoose.model('Director', directorSchema)