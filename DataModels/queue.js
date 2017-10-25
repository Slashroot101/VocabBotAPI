var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var queue = new Schema({
    name: String,
    timeQueued: Date,
    timeDue: Date,
    assignmentURL: String,
    completed: Boolean,
    completePercent: Number
});

module.exports = mongoose.model('Queue', queue);