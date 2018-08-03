const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;
const DEFAULT_ROLE_NAME = `BaseUser`;

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

Role.statics.getPermission = function getPermission (roleID, name){
    return this.model(`Role`)
    .find({ _id : mongoose.Types.ObjectId(roleID)})
    .populate({path :`permissions`, match : {name: name}}).exec();
};

Role.statics.getDefaultRole = function getDefaultRole ( ){
    return this.model(`Role`)
    .findOne({name : DEFAULT_ROLE_NAME})
    .exec();
};

Role.statics.findByName = function findByName (name){
    return this.model(`Role`).find({ name : name });
};

module.exports = mongoose.model('Role', Role);