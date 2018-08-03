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

Permission.statics.findByID = function findByID(id){
    return this.model(`Permission`)
    .findOne({ _id : id})
    .exec();
};

module.exports = mongoose.model('Permission', Permission);