var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  name: String,
  password: String,
  email: String,
  admin: Boolean(),
  role : String,
  //from teaching the bot questions/answers. Used for discounts on purchasing more
  addedPoints : Number(),
  availablePoints: Number(),
  totalUsedPoints: Number(),
  numQuestionsAnswered: Number(),
  lastUse: Date(),
  dateJoined: Date()
});

//TODO: CHANGE THE COST FACTOR OF THIS ENCRYPTION
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10 , function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);