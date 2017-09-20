var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var repliesSchema = new Schema({
	
    parent_id:{type: Number},
    notes: {type: String},
    files:{}

});

mongoose.model('Reply', repliesSchema);