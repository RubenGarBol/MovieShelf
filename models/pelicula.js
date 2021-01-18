const mongoose = require('mongoose')
//const director = require('./director')

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
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
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
    if (this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }

})

//Nombre de la tabla y definicion de la misma
module.exports = mongoose.model('Pelicula', peliculaSchema)