const ResponseHandler = require(`./responseHandler`);
const ErrorHandler = require(`./errorHandler`);
const config = require(`../../config`);
const jwt = require(`jsonwebtoken`);

exports.checkToken = (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                ErrorHandler.handleServerError(err, res, `Failed to verify token`);
            } else {
                console.log(decoded)
                req.decoded = decoded;
                next();
            }
        });
    } else {
        ResponseHandler(res, `No token was provided with this request`, {});
    }
};