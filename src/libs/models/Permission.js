const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

let permission = new Schema(
    {
        name: {
            type: String,
            required: true,
            index: {
                unique: true
            }
        }
    }
);

module.exports = mongoose.model('Permission', permission);