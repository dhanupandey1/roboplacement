var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
// var Admin = require('../admin');
// var Student = require('../student');
var Job = require('./job');
var Applied = require('./applied');
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
        // console.log(id);
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
       // console.log(user);
       user[0].Job.push(newuser);
      user[0].save();
     });

 });

 router.get('/:adminid',(req,res)=>{
   res.render('jobpost.ejs',{id:req.params.adminid});
 });

 router.get('/:id/showapplied',(req,res)=> {
   Job.find({}, (err,jobs)=> {
     var jobarr=[]
     var obj={}
     k=0;
     for(var i=0;i<jobs.length;i++){
         Student.find({},{_id:0, name:1, applied:{$elemMatch:{$eq:jobs[i]._id}}}, (err,result)=>{
           result=result[0];
           if (result.applied.length>0){
               k++;
            var x=result.name
             var y = jobs[k].job_title;
             // console.log(jobs)
             console.log(k);

             //jobarr.push(obj)

             var applied = new Applied({
                 _id: new mongoose.Types.ObjectId(),
                  name:x,
                  jname:y
             });
             // console.log(applied)
             // console.log("x="+x);
             //  console.log("y="+y);
             applied.save();

            // console.log(jobarr)
           }
           // console.log(i);

           // if(i==jobs.length){
           //   res.render('appliedjobs.ejs',{jobarr:jobarr});
           // }
          //console.log(jobarr);
         })
      }
      Applied.find({},(err,applied)=>{
        // console.log(applied)
        let outputArray = applied.filter(function(v, i, self)
            {
                return i == self.indexOf(v);
            });
            console.log(outputArray);
        res.render('appliedjobs.ejs',{applied:outputArray});
      })

       // console.log(i, jobarr);
        // console.log(jobarr[0]);
        // res.render('appliedjobs.ejs',{jobarr:jobarr});
   })
 });

 router.get('/apply/:jid/:sid',(req,res)=>{

 var id =  req.params.jid;
 Job.find({_id:id},(err,jobs)=>{

     Student.find({userid:req.params.sid},(err,student)=>{
       // console.log(student)
       // console.log(jobs)
       student[0].applied.push(jobs[0]);
       student[0].save();
       Job.find({},(err,result)=>{
         // console.log(result)
         var str="/job/afterapplied/"+req.params.sid
         // console.log(str)
         res.redirect(str)
       })
     })

 })

 });
 router.get('/afterapplied/:id',(req,res)=>{
   var id=req.params.id;
   // console.log(id,name)
    Job.find({},(err,result)=>{

    })
    .then(result=>{
      Student.find({userid:id},(err,re)=>{
        res.render('studentdashboard.ejs',{name:re.name,email:id,job:result})
      })
    })

 })

 router.get("/search/getjobs",(req,res)=>{

 async function getJobByLocation()
     {
     await client.search({
         index: 'jobpostcontroller',
         type: 'jobtype',
         body: {
          query: {
               match: {
                job_type: req.body.job_type
                   }
                 }
               }
          },function(err,resp,status){
             if(err){
                 console.log(err);
             }
             else{
                 let responsecity=[];
                 if(resp.hits.total.value<1) {
               res.status(200).send("No jobs match that query, please try again.");
             }else{
                    resp.hits.hits.forEach(function(hit){
                     responsecity.push(hit);
                     console.log(responsecity);
                 });
                    res.status(200).send(responsecity);
             }}
          });
     }
     getJobByLocation();
});
 module.exports = router;
