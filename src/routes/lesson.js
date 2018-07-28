var express = require('express');
var router = express.Router();
const Lesson = require(`../libs/lesson`);
const ResponseHandler = require(`../libs/responseHandler`);
const ErrorHandler = require(`../libs/errorHandler`);

router.post(`/`, async(req, res) => {
    try{
        let newLesson = await Lesson.create(req.body.lesson);
        ResponseHandler(res, `Succesfully created a lesson`, newLesson);
    } catch (err){
        ErrorHandler.handleServerError(err, res, `Failed to create a lesson`);
    }
});

router.get(`/site-id/:id`, async(req, res) => {
    try {
        let lesson = await Lesson.findBySiteID(req.params.id);
        ResponseHandler(res, `Sucessfully got lesson by site ID`, lesson);
    } catch (err){
        ErrorHandler.handleServerError(err, res, `Failed to get lesson by site ID`);
    }
});

module.exports = router;