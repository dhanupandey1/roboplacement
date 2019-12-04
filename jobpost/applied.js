var mongoose = require('mongoose');

var applied = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
name: String,

    jname:String



});


var Applied = module.exports = mongoose.model('Applied' , applied);
