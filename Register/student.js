var mongoose = require('mongoose');

var candschema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String
    },
    password: {
      type: String
    },

userid:String,
applied: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
}]

});


var Student = module.exports = mongoose.model('Student' , candschema);
