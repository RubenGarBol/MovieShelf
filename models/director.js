const mongoose = require('mongoose')

//"Tabla" director
const directorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

//Nombre de la tabla y definicion de la misma
module.exports = mongoose.model('Director', directorSchema)