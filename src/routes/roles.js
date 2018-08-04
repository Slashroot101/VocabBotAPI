var express = require('express');
var router = express.Router();
const Role = require(`../libs/role`);
const Permission = require(`../libs/permissions`);
const ResponseHandler = require(`../libs/responseHandler`);
const ErrorHandler = require(`../libs/errorHandler`);
const ObjectId = require(`mongoose`).Types.ObjectId;

router.post(`/`, async(req, res) => {
    try {
        let role = await Role.create(req.body.role);
        ResponseHandler(res, `Succesfully created a role!`, role);
    } catch (err) {
        ErrorHandler.handleServerError(err, res, `Failed to create role!`);
    }
});

router.put(`/:role_id/permissions`, async(req, res) => {
    try {
        let badPermIds = [];
        let goodPermIds = [];
        for(let i = 0; i < req.body.permissions.length; i++){
            if(ObjectId.isValid(req.body.permissions[i])){
                let perm = await Permission.findByID(req.body.permissions[i]);
                if(!perm){
                    badPermIds.push(req.body.permissions[i]);
                } else {
                    let rolePerm = await Role.hasPermission(req.params.role_id, req.body.permissions[i]);
                    if(rolePerm.length === 1){
                        badPermIds.push(req.body.permissions[i]);
                    } else {
                        goodPermIds.push(req.body.permissions[i]);
                    }
                }
            } else {
                badPermIds.push(req.body.permissions[i]);
            }
        }
        await Role.addPermission(req.params.role_id, goodPermIds);

        ResponseHandler(res, `Succesfully added permission(s)`, {badPermIds});
    } catch (err){
        ErrorHandler.handleServerError(err, res, `Failed to add permission(s) to role`);
    }
});

module.exports = router;
