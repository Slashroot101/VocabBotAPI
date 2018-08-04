var express = require('express');
var router = express.Router();
const Permissions = require(`../libs/permissions`);
const ResponseHandler = require(`../libs/responseHandler`);
const ErrorHandler = require(`../libs/errorHandler`);
const middlewares = require(`../libs/middlewares`);

router.use(middlewares.checkToken);

router.post(`/`, async(req, res) => {
    try {
        let newPerm = await Permissions.create(req.body.permission);
        ResponseHandler(res, `Succesfully created the permission!`, newPerm);
    } catch (err) {
        ErrorHandler.handleServerError(err, res, `Failed to create permission.`);
    }
});


module.exports = router;