var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var audioWord = new Schema({
    sentence: String,
    correctAnswer: String,
    dateCreated: Date(),
    addedBy: String,
    lessonURL: String
});


module.exports = mongoose.model('AudioWord', AudioWord);