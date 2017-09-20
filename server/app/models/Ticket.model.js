var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ticketSchema = new Schema({
	title: {type: String},
	type: {type: String},
	priority: {type: String},
	group: {type:String},
	requestor: {type: String},
	agent: [],
    description: {type: String},
    id:{type: Number},
    notes: {type: String}

});

mongoose.model('Ticket', ticketSchema);