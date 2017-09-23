var mongoose = require('mongoose');
var express = require('express');

var ticketRouter = express.Router();
var userTicket = mongoose.model('Ticket');
var ticketReply = mongoose.model('Reply');
var fileUpload = mongoose.model('File');
var responseGenerator = require('./../../library/responseGenerator');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var mailer = require('./../../library/email');
var randomString = require('./../../library/randomString');

var fs = require('fs');
var busboy = require('connect-busboy');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var formidable = require('formidable');

module.exports.controllerFunction = function(app){
     
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

     ticketRouter.get('/alltickets/check/:pageNum', function(req, res){
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
              });
              res.send(result);
            }
         });
    });

    ticketRouter.get('/singletickets/:ticketId', function(req, res){
         var ticketDetail = {};
         userTicket.find({'_id': req.params.ticketId}, function(err, result){
            if(err){
              console.log('An error occured while retrieving ticket details. Error:-'+err);
              var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
              res.send(myResponse);
            }else{
                 ticketDetail.main = result;
                 ticketReply.find({'parent_id': req.params.ticketId}, function(error, reply){
                    if(err){
                        console.log('An error occured while retrieving all reply. Error:-'+err);
                        var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                        res.send(myResponse);
                    }else{

                      ticketDetail.reply = reply;
                      res.send(ticketDetail);
                    }
                 });
              
            }
         });
    });
    
    ticketRouter.post('/file/upload/:ticketId', function(req, res){
            //var readerStream = fs.createReadStream(req.body);
            /*var fstream;
            req.pipe(req.busboy);
            req.busboy.on('file', function(fieldname, file, filename){
                console.log("Uploading: "+ filename);
                fstream = fs.createWriteStream(__dirname+'/'+filename);
                file.pipe(fstream);
                fstream.on('close', function(){
                  console.log('req'+JSON.stringify(req.busboy));
                  res.send('ok');
                });
            });*/
            
            var form = new formidable.IncomingForm();
            form.parse(req, function(err, fields, files){
                 var oldpath = files.filetoupload.path;
                 var newpath = 'E:/NewBegining/Project/Project1/ensmbleGuide/server'+'/uploads/'+files.filetoupload.name;
                 fs.rename(oldpath, newpath, function(err){
                      if(err){
                         res.send('error');
                      }else{
                        res.send('ok');
                      }
                 });
            });

            //console.log('req'+JSON.stringify(req.files));
            //res.send('ok');
    });

    ticketRouter.post('/createticket', function(req, res){

        var followerArray = [];
        followerArray.push(req.body.requestor);
        if(req.body.agent){
           followerArray.push(req.body.agent);
        }
        
        var newTicket = new userTicket({
            requestor   : req.body.requestor,
            subject     : req.body.subject,
            type        : req.body.type,
            status      : req.body.status,
            priority    : req.body.priority,
            group       : req.body.group,
            source      : req.body.source,
            agent       : req.body.agent,
            description : req.body.description,
            ticketNum   : req.body.ticketNum,
            followers   : followerArray,
            createdOn   : new Date()
        });
        
        newTicket.save(function(err, result){
            if(err){
               console.log('some error occured while creating product. ERR:-'+err);
               var myResponse = responseGenerator.generate(true,err,500,null);
               res.send(myResponse);
              

            }
            else{
                res.send('/product/products'+result);
               
            }
        });

    });
		
    ticketRouter.put('/update/:ticketId', function(req, res){
         var update = req.body;
         userTicket.findOneAndUpdate({'_id': req.params.ticketId}, update, function(err, result){
              if(err){
                    console.log('An error occured while updating ticket.'+req.params.ticketId+' Error:-'+err);
                    var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                    res.send(myResponse);
                  }else{

                    res.send(result);
              }
         });
    });

    ticketRouter.post('/delete/:ticketId', function(req, res){
         userTicket.remove({'_id': req.params.ticketId}, function(err, result){
              if(err){
                    console.log('An error occured while updating ticket.'+req.params.ticketId+' Error:-'+err);
                    var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                    res.send(myResponse);
                  }else{

                    res.send(result);
              }
         });
    });

    ticketRouter.post('/delete', function(req, res){
         userTicket.remove({}, function(err, result){
              if(err){
                    console.log('An error occured while updating ticket.'+req.params.ticketId+' Error:-'+err);
                    var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                    res.send(myResponse);
                  }else{

                    res.send(result);
              }
         });
    });
    
    ticketRouter.post('/reply/:ticketId', function(req, res){
          var newReply = new ticketReply({
              parent_id : req.params.ticketId,
              creator   : req.body.creator,
              createdon : new Date(),
              notes     : req.body.notes
            });
          newReply.save(function(err, result){
            if(err){
                  console.log('An error occured while updating ticket.'+req.params.ticketId+' Error:-'+err);
                  var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                  res.send(myResponse);
                }else{
                  var text = req.body.creator+' replied on your ticket:-'+req.params.ticketId;
                  var subject = 'Response Received on Your Ticket';
                  res.send(result);
                  var recepient = [];
                  recepient.push('pallabidas0492@gmail.com');
                  recepient.push(req.body.creator);
                  eventEmitter.emit('send email', recepient, subject, req.params.ticketId, text);
              }

          });
    });
    
    app.use('/ticket', ticketRouter);
}