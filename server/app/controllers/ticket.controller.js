var mongoose = require('mongoose');
var express = require('express');

var ticketRouter = express.Router();
var userTicket = mongoose.model('Ticket');
var ticketReply = mongoose.model('Reply');
var ticketFile = mongoose.model('File');
var userModel = mongoose.model('User');
var responseGenerator = require('./../../library/responseGenerator');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var mailer = require('./../../library/email');
var randomString = require('./../../library/randomString');
var fileUpload = require('./../../library/file.utility');
var currentPath = require('./../../library/getrootpath');

var multer = require('multer');
var path = require ('path');
var multiparty = require('multiparty');

var authenticate = require('./../../middlewares/authenticate');
var fs = require('fs');
var busboy = require('connect-busboy');
/*var multer = require('multer');
var upload = multer({dest: 'uploads/'});*/
var formidable = require('formidable');

module.exports.controllerFunction = function(app){
     //app.use(multer({ dest: './uploads/'}))
     eventEmitter.on('send email', function(creator, subject, ticketId, text){
        /*var recepient = [];
        recepient.push('pallabidas0492@gmail.com');
        recepient.push(creator);*/
        var text = text;
        var subject = subject;
        var mailResponse = mailer.mailFunc(subject, creator, text, function(mailResponse){
          console.log('email send'+mailResponse);
        });
     });

     eventEmitter.on('remove temp', function(file){
         if(fs.existsSync(file)){
            fs.unlinkSync(file);
         }
     });

     /*eventEmitter.on('add follower', function(ticketId, followers){
           userTicket.findOneAndUpdate({'_id': ticketId}, followers, function(err, res){
                   if(err){
                      console.log('some error occured while assigning user '+follower.email+' to ticket:-'+ ticketId);
                   }else{
                      console.log('user added');
                   }    
           });
     });
*/
     /*ticketRouter.get('/alltickets', function(req, res){
     	   userTicket.find({}).sort('-createdOn').limit(10).exec(function(err, result){
            if(err){
              console.log('An error occured while retrieving all supplier product. Error:-'+err);
              var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
              res.send(myResponse);
            }else{
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*',
                'link': 'id1234'
              });
              res.send(result);
            }
         });
    });*/

     ticketRouter.get('/alltickets/check/:pageNum', authenticate.authenticate, function(req, res){
         console.log(req.header('x-auth'));
         var count = parseInt(req.params.pageNum) + 1;
         var skipData = parseInt(req.params.pageNum) - 1;
         skipData *=  10;
         console.log(count);
         userTicket.find({}).skip(skipData).sort('-createdOn').limit(10).exec(function(err, result){
            if(err){
              console.log('An error occured while retrieving all supplier product. Error:-'+err);
              var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
              res.send(myResponse);
            }else{
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*',
                'link':  count
              }).status('200').send(result);
            }
         });
    });


    //<<<<<<<<<<<<<<<<<<Rote to get the Aggregate from Database>>>>>>>>>>>>>>>>>>>>>>>>>>///
      ticketRouter.get('/alltickets/aggregate', authenticate.authenticate, function(req, res){
         userTicket.aggregate([{$group: {_id: "$priority", count:{$sum:1}}}]).exec(function(err, result){
            if(err){
              console.log('An error occured while retrieving all supplier product. Error:-'+err);
              var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
              res.send(myResponse);
            }else{
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*'
              }).status('200').send(result);
            }
         });

      });


      ticketRouter.get('/alltickets/aggregate/unassigned', authenticate.authenticate, function(req, res){
          
         userTicket.aggregate([{$group: {_id: "$priority", count:{$sum:1}}}]).aggregate([{$group: {_id: "$agent", count:{$sum:1}}}]).exec(function(err, result){
            if(err){
              console.log('An error occured while retrieving all supplier product. Error:-'+err);
              var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
              res.send(myResponse);
            }else{
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*'
              }).status('200').send(result);
            }
         });

      });
    //<<<<<<<<<<<<<<<<<<Aggregate route ends here>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>///

    ticketRouter.get('/singleticket/:ticketId', authenticate.authenticate, function(req, res){
         var allData= {};
         userTicket.findOne({'_id': req.params.ticketId}, function(err, result){
            if(err){
              console.log('An error occured while retrieving ticket details. Error:-'+err);
              var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
              res.send(myResponse);
            }else{
                 ticketFile.find({'parent_id': req.params.ticketId}, function(err, data){
                        if(err){
                           console.log('An error occured while retrieving ticket details. Error:-'+err);
                          var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                          res.send(myResponse);
                          console.log(err);
                        }else{
                           allData = {
                            'ticket': result,
                            'files': data
                           }
                           //console.log(data);
                           //console.log(result.attachment);
                           result.attachment = [];
                           for(var indx in data){
                             if(data[indx].filename){
                                result.attachment.push(data[indx]);
                             }
                              
                           }
                           result.attachment.push(data);
                           res.set({
                              'Content-Type': 'application/json',
                              'ETag': '12345',
                              'Access-Control-Allow-Origin': '*'
                            }).status('200').send(result);
                        }
                 });
                
            }
         });
    });
    
    ticketRouter.post('/file/upload/:ticketId', authenticate.authenticate, function(req, res){
            //var readerStream = fs.createReadStream(req.body);
            
            //app.use(multer({ dest: './uploads/'+req.user.userName+'/'}).any());

            console.log(req.params.ticketId);

            var dir = './uploads/'+req.user.userName;
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
            
            for(indx in req.files){
                var readerStream = fs.createReadStream('./uploads/'+req.files[indx].filename);
                var filePath = '/uploads/'+req.files[indx].filename; 
                var dirName = currentPath.getRootDir();
                dirName += filePath;
                // Create a writable stream
                var writerStream = fs.createWriteStream(dir+'/'+req.files[indx].filename+req.files[indx].originalname);

                writerStream.on('pipe',function(source){
                  console.log("piping is being done ");
                  eventEmitter.emit('remove temp', dirName);
                  // you can also unpipe 

                });// end on pipe

                // Pipe the read and write operations
                readerStream.pipe(writerStream);

                readerStream.on('end',function(){
                  //fs.unlinkSync(dirName);
                  console.log("end of read stream");
                });

                writerStream.on('finish',function(){
                  //fs.unlinkSync(dirName);
                  //console.log(dirName);
                  console.log("end of writer stream");
                });
            }
            
            //app.use(busboy());
            //fileUpload.fileUpload(app, req, res);
             //console.log(req.body); // form fields
              //console.log(req.files); // form files
              //console.log(req.file);
              if(req.files){
                for(var data in req.files){
                    //data.fieldname;
                    //console.log(data);
                    var filePath = './uploads/'+req.user.userName+'/'+req.files[data].filename+req.files[indx].originalname;
                    var fileData = new ticketFile;
                    var filename = req.files[data].filename+req.files[indx].originalname;
                    var originalname = req.files[indx].originalname;
                    var encoding = req.files[indx].originalname;

                    var mimetype = req.files[indx].mimetype;
                    var destination = req.files[indx].destination;
                    var filename = req.files[indx].filename;
                    var path = req.files[indx].path;
                    var size = req.files[indx].size;

                    var fileData = new ticketFile({

                        parent_id: req.params.ticketId,
                        filename : req.files[data].filename+req.files[indx].originalname,
                        originalname : req.files[indx].originalname,
                        encoding : req.files[indx].originalname,
                        folder: req.user.userName,
                        mimetype :req.files[indx].mimetype,
                        destination :req.files[indx].destination,
                        path :req.files[indx].path,
                        size :req.files[indx].size
                    });

                    /*userTicket.findOneAndUpdate({'_id': req.params.ticketId}, 
                                               {$push: {"attachment": allData}},
                                                {safe: true,upsert: true}, function(err, tickets){

                          if(err){

                            console.log(err);
                          }else{
                            console.log(tickets);
                          }

                    });*/
                    fileData.save(function(err, result){
                       if(err){
                          console.log('some error occured while creating product. ERR:-'+err);
                          var myResponse = responseGenerator.generate(true,err,500,null);
                          //res.send(myResponse);
                       }else{
                           //res.send('/file'+result);
                       }
                    });


                }
                res.send('ok');
              }
              
    });
//app.use(multer({ dest: './uploads/'}).any()); //app.use(express.static(path.resolve(__dirname,'./../public')));
    ticketRouter.get('/files/:filename', function(req, res){
           ticketFile.findOne({'filename': req.params.filename}, function(err, result){
               if(err){
                  console.log('some error occured while creating product. ERR:-'+err);
                  var myResponse = responseGenerator.generate(true,err,500,null);
                  res.send(myResponse);
               }else{
                   //res.set();
                   console.log(path.resolve(__dirname));
              
                   var dirName = currentPath.getRootDir();
                   var userDir = result.folder;
                   //var default = "uploads";
                   var finalPath = dirName + '/' + 'uploads' + '/' + userDir;                
                   res.set('Content-Type: '+result.mimetype).sendFile(path.resolve(finalPath+'/' + result.filename));
               }
           });   
    });

    /*var multipartyMiddleWare = function(req, res, next){
        var form = new multiparty.Form();

        form.parse(req, function(err, fields, files){
             console.log(fields);
             console.log(files);
        });
        next();
    }*/

    ticketRouter.post('/createticket',  authenticate.authenticate,  function(req, res){

        

        //res.send('ok');
        //console.log(req.token);
        var followerArray = [];
        var createDate = new Date();
        var resolveDate = new Date();
        var priorityDays = 2;
        var normalDays = 3;
        var lowDays= 4;
        var agentDetail = {};
       
        //var ticketNum = autoInc.getNextSequenceValue("ticketId");

        followerArray.push({
          id: req.user._id,
          mobile:req.user.mobileNumber,
          userName:req.user.userName,
          email:req.user.email
        });

        

        if(req.body.priority == 'Critical'){
            resolveDate.setDate(createDate.getDate() + priorityDays);
        }else if(req.body.priority == 'Medium'){
             resolveDate.setDate(createDate.getDate() + normalDays);
        }else{
             resolveDate.setDate(createDate.getDate() + lowDays);
        }

        var newTicket = new userTicket({
            'requestor.id'   : req.user._id,
            'requestor.email'   : req.user.email,
            'requestor.mobile'   : req.user.mobileNumber,
            'requestor.userName'   : req.user.userName,
            subject     : req.body.subject,
            type        : req.body.type,
            status      : req.body.status,
            priority    : req.body.priority,
            group       : req.body.group,
            source      : req.body.source,
            'agent.email': req.body.agent,
            description : req.body.description,
            //ticketNum   : ticketNum,
            followers   : followerArray,
            createdOn   : createDate,
            dueBy       : resolveDate
        });
        
        newTicket.save(function(err, result){
            if(err){
               console.log('some error occured while creating product. ERR:-'+err);
               var myResponse = responseGenerator.generate(true,err,500,null);
               res.send(myResponse);
              

            }
            else{
                 res.set({
                      'Content-Type': 'application/json',
                      'ETag': '12345',
                      'Access-Control-Allow-Origin': '*'
                    }).status('200').send(result);
               
            }
        });

    });
		
    ticketRouter.put('/update/:ticketId', authenticate.authenticate, function(req, res){
         var update = req.body;
         userTicket.findOneAndUpdate({'_id': req.params.ticketId}, {$set: {
               'status': req.body.status,
               'priority': req.body.priority,
               'type': req.body.type,
               'agent.email': req.body.agent
         }}, function(err, result){
              if(err){
                    console.log('An error occured while updating ticket.'+req.params.ticketId+' Error:-'+err);
                    var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                    res.send(myResponse);
                  }else{

                     res.set({
                          'Content-Type': 'application/json',
                          'ETag': '12345',
                          'Access-Control-Allow-Origin': '*'
                        }).status('200').send(result);
              }
         });
    });

    ticketRouter.post('/delete/:ticketId', authenticate.authenticate, function(req, res){
         userTicket.remove({'_id': req.params.ticketId}, function(err, result){
              if(err){
                    console.log('An error occured while updating ticket.'+req.params.ticketId+' Error:-'+err);
                    var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                    res.send(myResponse);
                  }else{

                     res.set({
                        'Content-Type': 'application/json',
                        'ETag': '12345',
                        'Access-Control-Allow-Origin': '*'
                      }).status('200').send(result);
              }
         });
    });

    ticketRouter.post('/delete', authenticate.authenticate, function(req, res){
         userTicket.remove({}, function(err, result){
              if(err){
                    console.log('An error occured while updating ticket.'+req.params.ticketId+' Error:-'+err);
                    var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                    res.send(myResponse);
                  }else{

                     res.set({
                          'Content-Type': 'application/json',
                          'ETag': '12345',
                          'Access-Control-Allow-Origin': '*'
                        }).status('200').send(result);
              }
         });
    });

    ticketRouter.get('/getallreply/:ticketId', authenticate.authenticate, function(req, res){
           ticketReply.find({'parent_id': req.params.ticketId}, function(err, result){
                 if(err){
                    console.log('An error occured while updating ticket.'+req.params.ticketId+' Error:-'+err);
                    var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                    res.send(myResponse);
                 }else{
                    res.set({
                          'Content-Type': 'application/json',
                          'ETag': '12345',
                          'Access-Control-Allow-Origin': '*'
                        }).status('200').send(result);
                 }
           });    
    });
    
    ticketRouter.post('/reply/:ticketId', authenticate.authenticate, function(req, res){
          console.log(req.body);
          var createdBy = {
                            id: req.user._id,
                            mobile:req.user.mobileNumber,
                            userName:req.user.userName,
                            email:req.user.email
                          };
          var newReply = new ticketReply({
              parent_id : req.params.ticketId,
              creator   : createdBy,
              createdon : new Date(),
              notes     : req.body.text
            });

          newReply.save(function(err, result){
            if(err){
                  console.log('An error occured while updating ticket.'+req.params.ticketId+' Error:-'+err);
                  var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                  res.send(myResponse);
                }else{
                  var text = req.body.creator+' replied on your ticket:-'+req.params.ticketId;
                  var subject = 'Response Received on Your Ticket';
                   /*res.set({
                    'Content-Type': 'application/json',
                    'ETag': '12345',
                    'Access-Control-Allow-Origin': '*'
                  }).status('200').send(result);*/

                  //userTicket.updateFollowers(req.params.ticketId, creator).then(function(response){
                    userTicket.findOneAndUpdate({'_id': req.params.ticketId}, {$push: {"followers": createdBy}},
    {safe: true,upsert: true}, function(err, tickets){
                        if(err){
                            res.set({
                                  'Content-Type': 'application/json',
                                  'ETag': '12345',
                                  'Access-Control-Allow-Origin': '*'
                                }).status('404').send(err);  
                        }else{
                              res.set({
                                'Content-Type': 'application/json',
                                'ETag': '12345',
                                'Access-Control-Allow-Origin': '*'
                              }).status('200').send(result);
                              var recepient = new Array(tickets.followers.length);
                              for(var data in tickets.followers){
                                if(tickets.followers){
                                  recepient.push(tickets.followers[data].email);
                                }
                                 
                                 //console.log('resceda'+data);
                              }
                              for(var data in recepient){
                                  if(recepient[data] && recepient[data]!=undefined){
                                     //eventEmitter.emit('send email', recepient, subject, req.params.ticketId, text);
                                  }
                                  console.log(data+' -- '+ recepient[data]);
                              }
                              //recepient.push('pallabidas0492@gmail.com');
                              //recepient.push(createdBy.email);
                              //eventEmitter.emit('add follower',req.params.ticketId, createdBy);
                              //eventEmitter.emit('send email', recepient, subject, req.params.ticketId, text);
                        }
                  });

                  /*var recepient = [];
                  recepient.push('pallabidas0492@gmail.com');
                  recepient.push(createdBy.email);*/
                  //eventEmitter.emit('add follower',req.params.ticketId, createdBy);
                  //eventEmitter.emit('send email', recepient, subject, req.params.ticketId, text);
              }

          });
    });
    
    app.use('/ticket', ticketRouter);
}