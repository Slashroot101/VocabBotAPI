var express = require('express');
var router = express.Router();
var paragraphWord = require('../Models/paragraphWord');
var moment = require('moment');


router.get('/', function(req, res){
        paragraphWord.find(
            {
                "question.prompt" : req.query.prompt
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
        paragraphWord.deleteOne(
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
        var newparagraphWord = new paragraphWord(
            {
                question: {
                    prompt: req.body.question.prompt,
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

        newparagraphWord.save(function(err, data){
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
