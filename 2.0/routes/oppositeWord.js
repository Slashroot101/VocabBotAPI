var express = require('express');
var router = express.Router();
var oppositeWord = require('../Models/oppositeWord');
var moment = require('moment');


router.get('/', function(req, res){
        oppositeWord.find(
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
        oppositeWord.deleteOne(
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
        var newoppositeWord = new oppositeWord(
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

        newoppositeWord.save(function(err, data){
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
