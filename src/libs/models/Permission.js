const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

let Permission = new Schema(
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



module.exports = mongoose.model('Permission', Permission);