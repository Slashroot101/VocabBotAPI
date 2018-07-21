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
            type : [ { type : mongoose.Schema.Types.ObjectId, ref : `Permission`}],
            required: true,
            default: [],
            index: {
                unique: false
            }
        }
    }
);

Role.statics.hasPermission = function hasPermission (roleID, name){
    return this.model(`Role`)
    .find({ _id : mongoose.Types.ObjectId(roleID)})
    .populate({path :`permissions`, match : {name: name}}).exec();
};

Role.statics.findByName = function findByName (name){
    return this.model(`Role`).find({ name : name });
};

module.exports = mongoose.model('Role', Role);