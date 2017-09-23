var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var repliesSchema = new Schema({
	
    parent_id:{type: String},
    creator: {type: String},
    createdon: {type: Date},
    notes: {type: String},
    files:{}

});

mongoose.model('Reply', repliesSchema);