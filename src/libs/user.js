let User = require(`./models/User`);

exports.create = async (user) => {
    return new Promise(async(resolve, reject) => {
        let newUser = new User({
            username: user.username,
            password: user.password,
            email: user.email,
            role: user.role
        });
        
        let savedUser = await newUser.save();
        resolve(savedUser);
    });
};