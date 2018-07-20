const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

let Role = new Schema(
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

Role.statics.findByName = function findByName (name){
    return new Promise((resolve, reject) => {
        return this.model(`Role`).find({ name : name });
    });
};

module.exports = mongoose.model('Role', Role);