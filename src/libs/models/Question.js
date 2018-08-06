const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;
const moment = require(`moment`);

let StringWord = new Schema({
    lessonID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `Lesson`,
        index: {
            unique: false
        },
        required: true
    },
    prompt: {
        type: String,
        index: {
            unique: false
        },
        required: true
    },
    answer: {
        type: String,
        index: {
            unique: false
        },
        required: true
    },
    questionType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `QuestionType`,
        index: {
            unique: false
        },
        required: true
    },
    dateAnswered: {
        type: Date,
        default: moment(),
        required: true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `User`,
        index: {
            unique: false
        },
        required: true
    },
    accuracyArray: [Number]
});


module.exports = mongoose.model('StringWord', StringWord);