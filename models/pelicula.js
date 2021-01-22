const mongoose = require('mongoose')
<<<<<<< Updated upstream
//const director = require('./director')

=======
const path = require('path')
//const director = require('./director')

const coverBasePath = 'archivos/portadas'

>>>>>>> Stashed changes
//"Tabla" pelicula
const peliculaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    synopsis: {
        type: String,
    },
    premierDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    //Fecha en la que se añade la pelicula a la app
    creationDate: {       
        type: Date,
        required: true,
        default: Date.now
    },
<<<<<<< Updated upstream
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
=======
    coverImageName: {
>>>>>>> Stashed changes
        type: String,
        required: true
    },
    director: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Director'
    }
})

peliculaSchema.virtual('coverImagePath').get(function() {
<<<<<<< Updated upstream
    if (this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
=======
    if (this.coverImageName != null) {
        return path.join('/', coverBasePath, this.coverImageName)
>>>>>>> Stashed changes
    }

})

//Nombre de la tabla y definicion de la misma
<<<<<<< Updated upstream
module.exports = mongoose.model('Pelicula', peliculaSchema)
=======
module.exports = mongoose.model('Pelicula', peliculaSchema)
module.exports.coverBasePath = coverBasePath
>>>>>>> Stashed changes
