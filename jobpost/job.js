var mongoose = require('mongoose');

var jobpost = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    job_type: {
        type: String
    },
    job_description: {
      type: String
    },
    job_location:String,
    job_title : String,
    job_ctc   : String,
    Admin:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }



});


var Job = module.exports = mongoose.model('Job' , jobpost);
