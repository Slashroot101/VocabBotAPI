var express = require('express');
var router = express.Router();
const User = require(`../libs/user`);
const Role = require(`../libs/role`);
const ResponseHandler = require(`../libs/responseHandler`);
const ErrorHandler = require(`../libs/errorHandler`);

router.post(`/`, async(req, res) => {
  try {
    let defaultRole = await Role.getDefaultRole();
    req.body.user.role = defaultRole._id;
    let user = await User.create(req.body.user);
    ResponseHandler(res, `Sucessfully created a user!`, user);
  } catch (err) {
    ErrorHandler.handleServerError(err, res, `User was not able to be created`);
  }
});

module.exports = router;
