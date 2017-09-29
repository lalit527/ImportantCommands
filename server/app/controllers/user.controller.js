var mongoose = require('mongoose');
var express = require('express');

var userRouter = express.Router();
var userModel = mongoose.model('User');
var responseGenerator = require('./../../library/responseGenerator');
var authenticate = require('./../../middlewares/authenticate');

module.exports.controllerFunction = function(app){
     

     userRouter.get('/getallusers',  authenticate.authenticate, function(req, res){
         userModel.find({}, function(err, result){
              if(err){
                 res.set({
                        'Content-Type': 'text/plain',
                        'Content-Length': '123',
                        'ETag': '12345',
                        'Access-Control-Allow-Origin': '*'
                      }).status(404).send(err);
              }else{
                 res.set({
                        'Content-Type': 'text/plain',
                        'Content-Length': '123',
                        'ETag': '12345',
                        'Access-Control-Allow-Origin': '*'
                      }).status(200).send(result);
              }
         });
     });

     userRouter.post('/login',  function(req, res){
     	//res.set('Content-Type', 'text/plain');
     	console.log(JSON.stringify(req.body));
        /*res.set({
				  'Content-Type': 'text/plain',
				  'Content-Length': '123',
				  'ETag': '12345',
				  'Access-Control-Allow-Origin': '*'
				});*/
        userModel.findByCredentials(req.body.email, req.body.psw).then(function(result){
             console.log('C'+result);
             return result.generateAuthToken().then(function(token){
                console.log(token);
                res.set({
                        'Content-Type': 'text/plain',
                        'Content-Length': '123',
                        'ETag': '12345',
                        'Access-Control-Allow-Origin': '*',
                        'x-auth': token
                      }).send(result);
             })
        }).catch(function(e){
                console.log('e'+e);
                res.status(400).send();
        });
        console.log('Sync Issue');
    });
		

     userRouter.post('/signup', function(req, res){
          console.log(JSON.stringify(req.body));
          var newUser = new userModel({
                userName            : req.body.fname+''+req.body.lname,
                firstName           : req.body.fname,
                lastName            : req.body.lname,
                email               : req.body.email,
                mobileNumber        : req.body.mobile,
                password            : req.body.psw,
                admin               : 'Y'
            });
          //newUser.save().then();
          newUser.save(function(err, result){
                if(err){

                   //var myResponse = responseGenerator.generate(true,err,500,null);

                   console.log(err);
                   res.set({
              					  'Content-Type': 'text/plain',
              					  'Content-Length': '123',
              					  'ETag': '12345',
              					  'Access-Control-Allow-Origin': '*'
              					}).send(err);                
                }
                else{
                    newUser.generateAuthToken().then(function(token){
                         /*req.session.user = newUser;
                          delete req.session.user.password;
                          res.redirect('/user/dashboard');
  */                      //newUser.generateAuthToken();
                          res.set({
                                    'Content-Type': 'text/plain',
                                    'Content-Length': '123',
                                    'ETag': '12345',
                                    'Access-Control-Allow-Origin': '*',
                                    'x-auth': token
                                  }).send(result);
                          //res.send('ok');
                    });
                   
                }

            });//end new user save

     });


     app.use('/user', userRouter);
}