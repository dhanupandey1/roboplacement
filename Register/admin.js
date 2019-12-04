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
Job:
[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
}],
nameofstudent:{
  name : String,
  job : String
}
});


var Admin = module.exports = mongoose.model('Admin' , candschema);
