var express = require('express');
var router = express.Router();
var connection = require('../config/dbc')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Welcome to crud');
});

// To get all student data
router.get('/list',function(req,res,next){
query = "select * from student where is_deleted=false";
connection.query(query,function(err,results,fields){
    if(err) res.json([]);
    else  res.json(results); // Don't put results in json {} bracket file
});
});

//To add data to database

router.post('/add',function(req,res,next){
  if(req.body.name !=null && req.body.email !=null && req.body.password !=null){
    query = "insert into student(name,email,password)values('"+req.body.name+"','"+req.body.email+"','"+req.body.password+"')";
    connection.query(query, function (err,results,fields){
if(err) res.json({ack:'false',description:'error in query'});
else res.json({ack:'true', id:results.insertId});
    })

  }else{
    res.json({ack:'missing arguments'});
  }
});


//To update database
router.post('/update',function(req,res,next){
  if(req.body.id!=null && req.body.name!=null && req.body.email!=null && req.body.password!=null){
    query="update student set name='"+req.body.name+"',email='"+req.body.email+"',password='"+req.body.password+"' where id= '"+req.body.id+"'";
  connection.query(query,(err,results,fields)=>{
    if(err) res.json({ack:false,description:err.sqlMessages});
    else{
      if(results.affectedRows>0)res.json({ack:true});
      else res.json({ack:false,description:'invalid ID'});
      // console.log(results); used for getting fields of results
    }

    });
    }
    else {
      res.json({ack:false,msg:'Missing arguments'});
    }

});

//To delete database

router.post('/delete', function(req, res, next) {

  if(req.body.id !=null){
    query="update student set is_deleted=true where id='"+req.body.id+"'";
    connection.query(query,function(err,results,fields){
      if(err) res.json({ack:false,description:err.sqlMessages});
      else{
       // console.log(results);
       if(results.affectedRows>0)res.json({ack:true});
       else res.json({ack:false,description:'Invalid Id'});


      }
    });
    } else{
      res.json({ack:false, description:'missing arguments'});
    }
});
module.exports = router;
