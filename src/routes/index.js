var express = require('express');
var router = express.Router();
let ErrorHandler = require(`../libs/errorHandler`);
let ResponseHandler = require(`../libs/responseHandler`);
let User = require(`../libs/user`);
let jwt = require(`jsonwebtoken`);
let config = require(`../../config`);

router.post(`/login`, async(req,res) => {
  try {
    let user = await User.login(req.body.user.username, req.body.user.password);

    if(user){
      let returnedUser = {
        id: user._id,
        username: user.username,
        email: user.email
      };
      let token = jwt.sign(returnedUser, String(config.secret), {
        expiresIn: 1440
      });

      ResponseHandler(res, `Sucessfully logged in!`, token);
    } else {
      ResponseHandler(res, `Username or password was incorrect.`, {});
    }
  } catch (err){
    ErrorHandler.handleServerError(err, res, `Failed to login`);
  }
});

module.exports = router;
