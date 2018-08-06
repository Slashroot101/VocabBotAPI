const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

let QuestionType = new Schema({
    name: {
        type: String,
        index: {
            unique: false
        },
        required: true
    },
    frontEndClasseNames: [String]
});


module.exports = mongoose.model('QuestionType', QuestionType);