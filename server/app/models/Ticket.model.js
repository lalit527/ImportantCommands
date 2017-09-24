var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
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
    ticketNum:{type: Number, Default: 1},
    followers: [],
    createdOn: {type: Date},
    dueBy: {type: Date},
    resolvedOn : {type: Date},


});
autoIncrement.initialize(mongoose.connection);
ticketSchema.plugin(autoIncrement.plugin, { model: 'Ticket', field: 'ticketNum', startAt: 1, incrementBy: 1 });

mongoose.model('Ticket', ticketSchema);