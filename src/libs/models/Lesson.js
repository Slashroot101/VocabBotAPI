const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;
let moment = require(`moment`);

let Lesson = new Schema({
  siteLessonID: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  totalQuestionsAnswered: {
    type: Number,
    required: true,
    index: {
      unique: false
    },
    default: 0
  },
  totalQuestionsAnsweredCorrectly: {
    type: Number,
    required: true,
    index: {
      unique: false
    },
    default: 0
  },
  users: [{
    id: {
      type:  mongoose.Schema.Types.ObjectId,
      ref: `User`
    },
    totalQuestionsAnswered: {
      type: Number,
      required: true,
      index: {
        unique: false
      },
      default: 0
    },
    totalQuestionsAnsweredCorrectly: {
      type: Number,
      required: true,
      index: {
        unique: false
      },
      default: 0
    },
    startDate: {
      type: Date,
      required: true,
      index: {
        unique: false
      },
      default: moment()
    }
  }]
});

Lesson.statics.findBySiteID = function findBySiteID (SiteID){
  return this.model(`Lesson`)
  .find({ siteLessonID : SiteID })
  .populate({path :`users`}).exec();
};

Lesson.statics.addUser = function addUserBySiteID(SiteID, user){
  return this.model(`Lesson`).update(
    { siteLessonID : siteID},
    { $push : { users : user}}
  ).exec();
};

module.exports = mongoose.model('Lesson', Lesson);

