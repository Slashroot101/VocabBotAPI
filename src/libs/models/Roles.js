const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

let role = new Schema(
    {
        name: {
            type: String,
            required: true,
            index: {
                unique: true
            }
        },
        permissions:{
            type : [ { type : mongoose.Schema.Types.ObjectId, ref : `Permissions`}],
            required: true,
            default: [],
            index: {
                unique: false
            }
        }
    }
);

module.exports = mongoose.model('Role', role);