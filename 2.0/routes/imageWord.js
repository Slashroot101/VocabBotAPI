var express = require('express');
var router = express.Router();
var imageWord = require('../Models/imageWord');
var moment = require('moment');


router.get('/', function(req, res){
        imageWord.find(
            {
                "question.prompt" : req.query.prompt,
                "question.a1" : req.query.a1,
                "question.a2" : req.query.a2,
                "question.a3" : req.query.a3,
                "question.a4" : req.query.a4
            }, function(err, data){
                if(err){
                    return res.status(500).json(
                        {
                            success: false,
                            err: err
                        }
                    );
                } else {
                    if(data){
                        return res.json(
                            {
                                success: true,
                                data: data
                            }
                        );
                    } else {
                        return res.json(
                            {
                                success: false,
                                msg: "No data found"
                            }
                        );
                    }
                }
            }
        );
    }
);


router.delete('/:id', function(req, res){
        imageWord.deleteOne(
            {
                _id : new MongoId(req.params.id)
            }, function(err){
                if(err){
                    return res.status(500).json(
                        {
                            success: false,
                            err: err
                        }
                    );
                } else {
                    return res.json(
                        {
                            success: true
                        }
                    );
                }
            }
        );
    }
);


router.post('/new', function(req, res){
        if(req.body.isCorrect){
            var timesCorrect = 1;
        } else {
            var timesCorrect = 0;
        }
        var newimageWord = new imageWord(
            {
                question: {
                    prompt: req.body.question.prompt,
                    a1: req.body.question.a1,
                    a2: req.body.question.a2,
                    a3: req.body.question.a3,
                    a4: req.body.question.a4,
                    correctAnswer: req.body.question.correctAnswer
                },
                meta : {
                    timesEncountered: 1,
                    timesCorrect: timesCorrect
                },
                lesson: [
                    {
                        addedBy: req.body.lesson.addedBy,
                        URL: req.body.lesson.URL,
                        dateAdded: moment()
                    }
                ]
            }
        );

        newimageWord.save(function(err, data){
                if(err){
                    return res.status(500).json(
                        {
                            success: false,
                            err: err
                        }
                    )
                } else {
                    return res.json(
                        {
                            success: true,
                            data: data
                        }
                    );
                }
            }
        );

    }
);





module.exports = router;
