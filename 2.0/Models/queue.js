var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var queue = new Schema({
    meta : {

        timeQueued: Date,
        timeDue: Date,
    },
    completionData : {
        completionMessage: String,
        completed: Boolean,
        completePercent: Number,
        inProgress: Boolean
    },
    config : {
        apiLogin : {
            username : String,
            password : String
        },
        user : {
            username: String,
            password: String
        },
        assignmentURL: String
    }
});


module.exports = mongoose.model('Queue', queue);