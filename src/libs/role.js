let Role = require(`./models/Role`);

exports.create = (role) => {
    return new Promise(async (resolve, reject) => {
        let newRole = new Role({
            name: role.name,
            permissions: role.permissions
        });

        let savedRole = await newRole.save();
        resolve(savedRole);
    });
};

exports.getDefaultRole = async() => {
    return new Promise(async(resolve, reject) => {
        let defaultRole = await Role.getDefaultRole();

        resolve(defaultRole);
    });
}

