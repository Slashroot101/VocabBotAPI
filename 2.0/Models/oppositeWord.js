var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var oppositeWord = new Schema(
    {
        question: {
            prompt: {
                type: String,
                required: true
            },
            a1: {
                type: String,
                required: true
            },
            a2: {
                type: String,
                required: true
            },
            a3: {
                type: String,
                required: true
            },
            a4: {
                type: String,
                required: true
            },
            correctAnswer: {
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





module.exporst = mongoose.Model("OppositeWord", oppositeWord);