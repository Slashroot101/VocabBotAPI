let Permission = require(`./models/Permission`);

exports.create = async(name) => {
    return new Promise(async (resolve, reject) => {
        let newPermission = new Permission({
            name: name
        });

        let savedPerm = await newPermission.save();
        resolve(savedPerm);
    });
};

exports.findByID = async(id) => {
    return new Promise(async(resolve, reject) => {
        let permission = await Permission.findByID(id);

        resolve(permission);
    });
};