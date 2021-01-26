var mongoose = require('mongoose')


var param = new mongoose.Schema({
    nome_param: { type: String, required: true },
    tipo_param: { type: String, required: true },
});


var tipoSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    parametros: { type: [param], default: [] },

});

module.exports = mongoose.model('tipo', tipoSchema, 'tipos')
