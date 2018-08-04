let User = require(`./models/User`);

exports.create = async (user) => {
    return new Promise(async(resolve) => {
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

exports.login = async(username, password) => {
    return new Promise(async(resolve) => {
        let Username = await User.findByUsername(username);
        if(!Username){
            resolve();
        }

        let Password = await Username.comparePassword(password);

        if(Password){
            resolve(Username);
        } else {
            resolve();
        }
    });
};