var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ticketSchema = new Schema({
	requestor: {type: String},
	subject: {type: String},
	type: {type: String},
    status: {type: String},
	priority: {type: String},
	group: {type:String},
	source: {type: String},
	agent: {type: String},
    description: {type: String},
    ticketNum:{type: Number},
    followers: [],
    createdOn: {type: Date}

});

mongoose.model('Ticket', ticketSchema);