var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var bcrypt = require('bcrypt-nodejs');
var User = new Schema(
    {
        authenticators: {
            username: {
                type: String,
                required: true,
                index: {
                    unique: true
                }
            },
            password: {
                type: String,
                required: true,
                index: {
                    unique: false
                }
            }
        },
        contact: {
            email: {
                type: String,
                required: false,
                index: {
                    unique: true
                }
            }
        },
        permissions: {
            role: {
                type: String,
                required: true,
                index: {
                    unique: false
                },
                default: "Client"
            }
        },
        points: {
            currentPointsAvailable: {
                type: Number,
                required: true,
                default: 0
            },
            totalBoughtPoints: {
                type: Number,
                required: false,
                index: {
                    unique: false
                },
                default: 0
            },
            totalSpentPoints: {
                type:Number,
                required: false,
                index: {
                    unique: false
                },
                default: 0
            },
            pointPurchaseHistory: [
                {
                    date: {
                        type: Date,
                        required: true,
                        default: moment()
                    },
                    amount: {
                        type: Number,
                        required: true
                    },
                    addedBy: {
                        type: String,
                        required: true
                    }
                }
            ]
        },
        meta: {
            totalQuestionsAnswered: {
                type: Number,
                required: true,
                default: 0
            },
            totalQuestionsLearned: {
                type: Number,
                required: true,
                default: 0
            },
            dateJoined: {
                type: Date,
                required: true,
                default: moment()
            },
            lessonHistory: [
                {
                    url: {
                        type: String,
                        required: true
                    }
                }
            ]
        }
    }
);


User.pre('save', function (next) {
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

User.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};


module.exports = mongoose.model('User', User);