var express = require('express');
var router = express.Router();
const Role = require(`../libs/role`);
const ResponseHandler = require(`../libs/responseHandler`);
const ErrorHandler = require(`../libs/errorHandler`);

router.post(`/`, async(req, res) => {
    try {
        let role = await Role.create(req.body.role);
        ResponseHandler(res, `Succesfully created a role!`, role);
    } catch (err) {
        ErrorHandler.handleServerError(err, res, `Failed to create role!`);
    }
});

module.exports = router;
