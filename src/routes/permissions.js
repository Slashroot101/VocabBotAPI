var express = require('express');
var router = express.Router();
const Permissions = require(`../libs/permissions`);
const ResponseHandler = require(`../libs/responseHandler`);
const ErrorHandler = require(`../libs/errorHandler`);
const {checkToken, hasPermission} = require(`../libs/middlewares`);
const permList = require(`../../permissions`);

router.use(checkToken);

router.post(`/`, hasPermission(permList.permission.WRITE), async(req, res) => {
    try {
        console.log(req.decoded)
        let newPerm = await Permissions.create(req.body.permission);
        ResponseHandler(res, `Succesfully created the permission!`, newPerm);
    } catch (err) {
        ErrorHandler.handleServerError(err, res, `Failed to create permission.`);
    }
});


module.exports = router;