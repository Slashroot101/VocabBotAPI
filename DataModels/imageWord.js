// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
// all of the strings in here are the path of the images on the server
var imageWord = new Schema({
  prompt: String,
  choices: {
    a1: String,
    a2: String,
    a3: String,
    a4: String
  },
  correctAnswer: String,
  dateCreated: Date,
  addedBy: String,
  lessonURL: String
});


var User = mongoose.model('Image', imageWord);
