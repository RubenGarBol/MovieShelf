const mongoose = require('mongoose')
const path = require('path')
//const director = require('./director')

const coverBasePath = 'archivos/portadas'

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
    coverImageName: {
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
    if (this.coverImageName != null) {
        return path.join('/', coverBasePath, this.coverImageName)
    }

})

//Nombre de la tabla y definicion de la misma
module.exports = mongoose.model('Pelicula', peliculaSchema)
module.exports.coverBasePath = coverBasePath