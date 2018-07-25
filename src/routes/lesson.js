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



module.exports = router;