var express = require('express');
var router = express.Router();
const Lesson = require(`../libs/lesson`);
const ResponseHandler = require(`../libs/responseHandler`);
const ErrorHandler = require(`../libs/errorHandler`);
const {checkToken, hasPermission} = require(`../libs/middlewares`);
const permList = require(`../../permissions`);

router.use(checkToken);

router.post(`/`,
 hasPermission(permList.lesson.WRITE),
 async(req, res) => {
    try{
        let newLesson = await Lesson.create(req.body.lesson);
        ResponseHandler(res, `Succesfully created a lesson`, newLesson);
    } catch (err){
        ErrorHandler.handleServerError(err, res, `Failed to create a lesson`);
    }
});

router.put(`/site-id/:site_id/user/:user_id`,
 hasPermission(permList.lesson.EDIT),
 async(req, res) => {
    try {
        let lesson = await Lesson.doesUserExist(req.params.site_id, req.params.user_id);

        if(lesson){
            return ResponseHandler(res, `User already exists.`, lesson);
        }

        await Lesson.addUser(req.params.site_id, req.params.user_id);
        ResponseHandler(res, `Succesfully added user`, {});
    } catch (err){
        ErrorHandler.handleServerError(err, res, `Failed to add new user`);
    }
});

router.get(`/site-id/:id`,
 hasPermission(permList.lesson.READ),
 async(req, res) => {
    try {
        let lesson = await Lesson.findBySiteID(req.params.id);
        ResponseHandler(res, `Sucessfully got lesson by site ID`, lesson);
    } catch (err){
        ErrorHandler.handleServerError(err, res, `Failed to get lesson by site ID`);
    }
});

module.exports = router;