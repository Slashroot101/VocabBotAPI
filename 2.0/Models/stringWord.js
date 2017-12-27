var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stringWord = new Schema(
    {
        question: {
            prompt: String,
            a1: String,
            a2: String,
            a3: String,
            a4: String,
            correctAnswer: String
        },
        meta: {
         timesEncoutered: Number,
         percentCorrect: Number, //good for tracking bugs -- if the logic is wrong, this number will be low.
         lesson: [
            {
                addedBy: String,
                URL: String,
                dateAdded: Date
            }
         ]   
        }
    }
);

module.exports = mongoose.model('StringWord', stringWord);