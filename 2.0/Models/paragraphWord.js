var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paragraphWord = new Schema(
    {
        question: {
            prompt: {
                type: String,
                required: true
            },
            correctAnswer:
            {
                type: String,
                required: true
            }
        },
        meta: {
         timesEncoutered: {
            type: Number,
            required: true
        },
         percentCorrect: {
            type: Number,
            required: true
        }, //good for tracking bugs -- if the logic is wrong, this number will be low.
         lesson: [
            {
                addedBy: {
                    type: String,
                    required: true
                },
                URL: {
                    type: String,
                    required: true
                },
                dateAdded: {
                    type: Date,
                    required: true
                }
            }
         ]   
        }
    }
);

module.exports = mongoose.model('ParagraphWord', paragraphWord);