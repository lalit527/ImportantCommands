var mongoose = require('mongoose');
var express = require('express');

var userRouter = express.Router();
var userModel = mongoose.model('User');
var responseGenerator = require('./../../library/responseGenerator');

module.exports.controllerFunction = function(app){
     
     userRouter.post('/login', function(req, res){
     	//res.set('Content-Type', 'text/plain');
     	console.log(JSON.stringify(req.body));
        res.set({
				  'Content-Type': 'text/plain',
				  'Content-Length': '123',
				  'ETag': '12345',
				  'Access-Control-Allow-Origin': '*'
				});
        userModel.findOne({$and:[{'email':req.body.email},{'password':req.body.psw}]},function(err,foundUser){
        	console.log('foundUser${foundUser}');
        	console.log('foundUser'+foundUser);
            if(err){
                var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                res.send(myResponse);
            }
            else if(foundUser==null || foundUser==undefined || foundUser.userName==undefined){

                var myResponse = responseGenerator.generate(true,"user not found. Check your email and password",404,null);
                res.send(myResponse);
                /*res.render('error', {
                  message: myResponse.message,
                  error: myResponse.data
                });*/

            }
            else{

                var myResponse = responseGenerator.generate(false,"successfully logged in user",200,foundUser);
                res.send(myResponse);
                /*req.session.user = foundUser;
                delete req.session.user.password;
                res.redirect('/user/dashboard')  */

            }

        });// end find

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
          newUser.save(function(err){
                if(err){

                   //var myResponse = responseGenerator.generate(true,err,500,null);
                   res.set({
					  'Content-Type': 'text/plain',
					  'Content-Length': '123',
					  'ETag': '12345',
					  'Access-Control-Allow-Origin': '*'
					});
                   res.send('err');
                  

                }
                else{
                    /*req.session.user = newUser;
                    delete req.session.user.password;
                    res.redirect('/user/dashboard');*/
                    res.set({
					  'Content-Type': 'text/plain',
					  'Content-Length': '123',
					  'ETag': '12345',
					  'Access-Control-Allow-Origin': '*'
					});
                    res.send('ok');
                   
                }

            });//end new user save

     });


     app.use('/user', userRouter);
}