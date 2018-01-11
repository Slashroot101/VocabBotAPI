var express = require('express');
var router = express.Router();
var audioWord = require('../Models/audioWord');
var moment = require('moment');


router.get('/', function(req, res){
        audioWord.find(
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
        audioWord.deleteOne(
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
        var newaudioWord = new audioWord(
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

        newaudioWord.save(function(err, data){
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
