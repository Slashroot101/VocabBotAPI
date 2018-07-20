const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;
const bcrypt = require(`bcrypt`)

let user = new Schema(
    {
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
        },
        email: {
            type: String,
            required: false,
            index: {
                unique: true
            }
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Roles',
            default: 0
        }
    }
);

user.pre('save', function (next) {
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

user.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', user);