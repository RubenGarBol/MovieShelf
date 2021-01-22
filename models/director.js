const mongoose = require('mongoose')
<<<<<<< Updated upstream
const Pelicula = require('./pelicula')
=======
>>>>>>> Stashed changes

//"Tabla" director
const directorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

<<<<<<< Updated upstream
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

=======
>>>>>>> Stashed changes
//Nombre de la tabla y definicion de la misma
module.exports = mongoose.model('Director', directorSchema)