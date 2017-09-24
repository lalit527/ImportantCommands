var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var repliesSchema = new Schema({
	
    ticket      :{data: Buffer, contentType: String},
    parent_id : {type: String}

});

mongoose.model('File', repliesSchema);