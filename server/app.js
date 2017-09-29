var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var currentPath = require('./library/getrootpath');
//var auth = require("./middlewares/auth");
var path = require ('path');
var multer = require('multer');
var multiparty = require('multiparty');
app.use(multer({ dest: './uploads/'}).any());
//app.use(express.json());
//app.use(express.urlencoded());
app.use(logger('dev'));
app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(cookieParser());

//var upload = multer({dest: 'uploads/'});

app.use(session({
	name: 'ensembleCookie',
	secret: 'ensembleSecret',
	resave: true,
	httpOnly: true,
	saveUninitialize: true,
	cookie: {secure: false}
}));

app.use(express.static(path.resolve(__dirname,'./../public')));

/*app.get('/', function(req, res){
      res.sendFile(__dirname + '../public/index.html');
});*/
currentPath.setRootDir(path.resolve(__dirname));
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