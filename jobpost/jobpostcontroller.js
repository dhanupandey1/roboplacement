var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
// var Admin = require('../admin');
// var Student = require('../student');
var Job = require('./job');
var Student = require('../Register/student.js');
var Admin = require('../Register/admin.js');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
extended: true
}));
router.use(bodyParser.json());


router.post('/admin/:id' , (req,res)=>{

        var job_type = req.body.job_type;
        var job_description = req.body.job_description;
         var   job_location = req.body.job_location;
         var job_title = req.body.job_title;
        var job_ctc    =   req.body.job_ctc;
        var id = req.params.id;
        console.log(id);
      var newuser = new Job({
          _id: new mongoose.Types.ObjectId(),
             job_type : job_type,
             job_description : job_description,
             job_location   : job_location,
             job_title:    job_title,
             job_ctc  : job_ctc

      });



     newuser.save()
     .then(user =>{
         // res.status(201).json({
         //     userCreated: user
         // });
         Admin.find({userid:id},(err,user)=>{
        res.render("admindashboard.ejs",{name:user[0].name,email:id})
                })

     })
     .catch(err => {
         console.log(err);
         res.status(500).json({error: err});
     });
     Admin.find({userid:id},(err,user)=>{
       console.log(user);
       user[0].Job.push(newuser);
      user[0].save();
     });

 });

 router.get('/:adminid',(req,res)=>{
   res.render('jobpost.ejs',{id:req.params.adminid});
 });

 router.get('/apply/:jid/:sid',(req,res)=>{

 var id =  req.params.jid;
 Job.find({_id:id},(err,jobs)=>{

     Student.find({userid:req.params.sid},(err,student)=>{
       console.log(student)
       console.log(jobs)
       student[0].applied.push(jobs[0]);
       student[0].save();
       Job.find({},(err,result)=>{
         console.log(result)
         res.render('studentdashboard.ejs',{name:student[0].name,email:req.params.sid,job:result[0]})
       })
     })

 })

 });
 module.exports = router;
