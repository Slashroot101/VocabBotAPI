var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var oppositeWord = new Schema({
    prompt : String,
    choices : {
        a1 : String,
        a2 : String,
        a3 : String,
        a4 : String
    },
    correctAnswer : String,
    dateCreated : Date,
    addedBy : String,
    lessonURL : String
});

module.exports = mongoose.model('OppositeWord', oppositeWord);