var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var audioWord = new Schema({
    prompt: String,
    correctAnswer: String,
    dateCreated: Date,
    addedBy: String,
    lessonURL: String
});


module.exports = mongoose.model('AudioWord', audioWord);