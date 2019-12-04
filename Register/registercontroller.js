var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Admin = require('./admin');
var Job   = require('../jobpost/job');
var Applied   = require('../jobpost/applied');
var Student = require('./student');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
extended: true
}));
router.use(bodyParser.json());


router.post('/' , (req,res)=>{


  var x = req.body.input;

  var fname = req.body.fname;
    var lname = req.body.lname;
    var name=fname+" "+lname;
    var password = req.body.password;
    var userid   = req.body.userid;
    if(x=="Admin"){
      var newuser = new Admin({
          _id: new mongoose.Types.ObjectId(),
          name: name,
          password: password,
          userid : userid
      });
     newuser.save()
     .then(user =>{
         // res.status(201).json({
         //     userCreated: user
         // });
         res.render("index.ejs")
     })
     .catch(err => {
         console.log(err);
         res.status(500).json({error: err});
     });
    }
    else{
      var newuser = new Student({
          _id: new mongoose.Types.ObjectId(),
          name: name,
          password: password,
          userid : userid
      });
     newuser.save()
     .then(user =>{
         // res.status(201).json({
         //     userCreated: user
         // });
         res.render("index.ejs")
     })
     .catch(err => {
         console.log(err);
         res.status(500).json({error: err});
     });
    }
   });



   router.post('/login' , (req,res)=>{
          var x = req.body.input;
          // console.log(x);
         email = req.body.email;
         password=req.body.password;
         // console.log(email)
         if(x=="Student"){
         Student.find({userid:email},(err,user)=>{
           if(err)
           {
             console.log(err);
           }
           else{
             Job.find({}).sort({_id:-1}).limit(6).exec((err,jobs)=>{
               user=user[0]
               // console.log(user.password)
               if(user.password==password)
               {
                 res.render("studentdashboard.ejs",{name:user.name,email:user.userid,job:jobs});
               }

             })

           }
         })
       }
       else{
         Admin.find({userid:email},(err,user)=>{
           if(err)
           {
             console.log(err);
           }
           else{
             user=user[0]
             // console.log(user.password)
             if(user.password==password)
             {
               res.render("admindashboard.ejs",{name:user.name,email:user.userid});
             }
           }
         })
       }


      });

router.get('/:id',(req,res)=>{
Job.find({},(err,jobs)=>{
  // console.log(jobs);
  res.render("jobstemplate.ejs",{job:jobs});
});


});

router.get('/:ssid/appliedjobs',(req,res)=>{
Student.find({userid:req.params.ssid},(err,student)=>{
  stuent= student[0];
  //console.log(student[0].name);
if(err)
{
  console.log(err);
}
else{
  arr=[];
  //Student.find({},{_id:0, name:1, applied:{$elemMatch:{$eq:jobs[i]._id}}}, (err,result)
 Applied.find({name:student[0].name},(err,result)=>{
  //var x  =   result[0].jname;
  console.log(result);
  for(i=0;i<result.length;i++)
  {
    arr.push(result[i].jname)
  //  console.log(arr[i]);
  }
//  console.log(x);
 res.render("studentjobs.ejs",{x:arr})
  })
}
});

});



// router.get('/', (req, res) => {
// console.log("req all users");
// var page = parseInt(req.query.page);
// var size = 10;
// if ( page < 0 || page === 0 ) {
//     response = {
//         "error": true,
//         "message": "invalid page number, should start with 1"
//     };
//     res.json( response );
// }
// var query = {}
// var skip = size * ( page - 1 )
// var limit = size
// User.find({},{},{skip:skip,limit:limit}).sort({_id:-1}).exec(function ( err, users ){
// if (err) return res.status(500).send({
// msg: "There was a problem finding the users."
// });
// res.status(200).json(users);
// });
// });
//
//
//
//
//
// router.post('/users/:id', (req, res) => {
//
//   User.findById(req.params.id,(err,user)=>{
//       if(err)
//       return console.log(err)
//       res.status(200).json(user);
//
//     });
//
// });
//
//
// router.post('/updateuser/:id',(req,res)=>{
//   var name = req.body.name;
//   var password = req.body.password;
//   var user_info = req.body.user_info;
//   var user_edu = req.body.user_edu;
//   var technical_skills = req.body.technical_skills;
//   var personal_skills = req.body.personal_skills;
//   var projects = req.body.projects;
//   var kyc1= req.body.kyc1;
//   var kyc2= req.body.kyc2;
//   var edituser={
//     name: name,
//     password: password,
//     user_info: user_info,
//     user_edu: user_edu,
//     technical_skills: technical_skills,
//     personal_skills: personal_skills,
//     projects: projects,
//     kyc1: kyc1,
//     kyc2: kyc2
//   }
//
//   User.findByIdAndUpdate(req.params.id,edituser, function(err,editeduser){
//         if(err)
//         {
//           res.status(500).json({
//          error: err});
//         }
//         else{
//
//             res.status(200).json(editeduser);
//
//         }
//     });
// });
//







module.exports = router;
