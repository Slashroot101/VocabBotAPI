let User = require(`./models/User`);

exports.create = async (user) => {
    return new Promise((resolve, reject) => {
        let newUser = new User({
            username: user.username,
            password: user.password,
            email: user.email,
            role: user.role
        });

    await newUser.save();
    });
};