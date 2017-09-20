var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
//var auth = require("./middlewares/auth");
var path = require ('path');

app.use(logger('dev'));
app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(cookieParser());

app.use(session({
	name: 'ensembleCookie',
	secret: 'ensembleSecret',
	resave: true,
	httpOnly: true,
	saveUninitialize: true,
	cookie: {secure: false}
}));


var connection = require('./config/dbconnection');

var fs = require('fs');

fs.readdirSync('./app/models').forEach(function(file){
     if(file.indexOf('.js')){
        require('./app/models/'+file);
     }
});
 
fs.readdirSync('./app/controllers').forEach(function(file){
     if(file.indexOf('.js')){
        var route = require('./app/controllers/'+file);
        route.controllerFunction(app);
     }
});

app.listen('3000', function(){
	console.log('listening on 3000');
});