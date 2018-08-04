let Role = require(`./models/Role`);

exports.create = (role) => {
    return new Promise(async (resolve) => {
        let newRole = new Role({
            name: role.name,
            permissions: role.permissions
        });

        let savedRole = await newRole.save();
        resolve(savedRole);
    });
};

exports.getDefaultRole = async() => {
    return new Promise(async(resolve) => {
        let defaultRole = await Role.getDefaultRole();

        resolve(defaultRole);
    });
};

exports.hasPermission = async(roleID, permissionID) => {
    return new Promise(async(resolve) => {
        let perm = await Role.hasPermission(roleID, permissionID);

        resolve(perm);
    });
};

exports.addPermission = async(roleID, permissionIDs) => {
    return new Promise(async(resolve) => {
        await Role.addPermission(roleID, permissionIDs);

        resolve();
    });
};

