var mongoose = require('mongoose');
var express = require('express');

var ticketRouter = express.Router();
var userTicket = mongoose.model('Ticket');
var ticketReply = mongoose.model('Reply');
var ticketFile = mongoose.model('File');
var responseGenerator = require('./../../library/responseGenerator');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var mailer = require('./../../library/email');
var randomString = require('./../../library/randomString');
var fileUpload = require('./../../library/file.utility');
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


    //<<<<<<<<<<<<<<<<<<Rote to get the Aggregate from Database>>>>>>>>>>>>>>>>>>>>>>>>>>///
      ticketRouter.get('/alltickets/aggregate', function(req, res){
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
              });
              res.send(result);
            }
         });

      });


      ticketRouter.get('/alltickets/aggregate/unassigned', function(req, res){
          
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
              });
              res.send(result);
            }
         });

      });
    //<<<<<<<<<<<<<<<<<<Aggregate route ends here>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>///

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
            
            //app.use(busboy());
            //fileUpload.fileUpload(app, req, res);
             //console.log(req.body); // form fields
              console.log(req.files); // form files
              //console.log(req.file);
              if(req.files){
                for(var data in req.files){
                    //data.fieldname;
                    //console.log(data);
                    var filePath = './uploads/'+req.files[data].filename;
                    var fileData = new ticketFile;
                    /*({
                      data : fs.readFileSync(filePath),
                      contentType : data.mimetype,
                      parent_id: '1'
                    });*/
                    fileData.ticket.data = fs.readFileSync(filePath);
                    fileData.ticket.contentType = req.files[data].mimetype;
                    fileData.parent_id = '2';
                    fileData.save(function(err, result){
                       if(err){
                          console.log('some error occured while creating product. ERR:-'+err);
                          var myResponse = responseGenerator.generate(true,err,500,null);
                          res.send(myResponse);
                       }else{
                           res.send('/file'+result);
                       }
                    });
                }
              }
    });

    ticketRouter.get('/files/:parentId', function(req, res){
           ticketFile.find({'parent_id': req.params.parentId}, function(err, response){

           });   
    });

    ticketRouter.post('/createticket', function(req, res){

        var followerArray = [];
        var createDate = new Date();
        var resolveDate = new Date();
        var priorityDays = 2;
        var normalDays = 3;
        var lowDays= 4;
        
        //var ticketNum = autoInc.getNextSequenceValue("ticketId");

        followerArray.push(req.body.requestor);
        if(req.body.agent){
           followerArray.push(req.body.agent);
        }
        

        if(req.body.priority == 'Critical'){
            resolveDate.setDate(createDate.getDate() + priorityDays);
        }else if(req.body.priority == 'Medium'){
             resolveDate.setDate(createDate.getDate() + normalDays);
        }else{
             resolveDate.setDate(createDate.getDate() + lowDays);
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