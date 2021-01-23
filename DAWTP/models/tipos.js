var mongoose = require('mongoose')


var param = new mongoose.Schema({
    nome_param:String,
    tipo_param:String
});


var tipoSchema = new mongoose.Schema({
    _id:String,
    nome:String,
    parametros:[param]

});

module.exports= mongoose.model('tipo', tipoSchema,'tipos')
