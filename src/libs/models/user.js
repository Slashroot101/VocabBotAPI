const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

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
            type: Number,
            required: true,
            index: {
                unique: false
            },
            default: 0
        }
    }
);


module.exports = mongoose.model('User', user);