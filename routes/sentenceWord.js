var express = require('express');
var router = express.Router();
var sentenceWord = require('../DataModels/sentenceWord');
var User = require('../DataModels/user');
var jwt = require('jsonwebtoken');
var cookie = require('cookie');
var config = require('../config.js');
var moment = require('moment');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});


//route middlware to verify token
router.use(function (req, res, next) {
    let cookies = cookie.parse(req.headers.cookie || '');
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        /*return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
        */
        res.json({
            success: false,
            error: 'Token not provided or a bad token was provided. Please login and retry.'
        });
    }
});

router.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
    var decoded = jwt.decode(token);
    console.log(decoded.name);
    User.findOne({
        name: decoded.name
    }, function (err, data) {
        if (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: err
            });
        }
        if (data.availablePoints >= config.weights.sentenceWordWeight || data.admin) {
            next();
        } else {
            res.json({
                success: false,
                error: 'Not enough points available, please buy more points or teach the bot new words to gain more.'
            });
        }
        //console.log(data);
    });
});

router.post('/create', function (req, res, next) {
    console.log(`Posting string word!`);
    var newWord1 = new sentenceWord({
        prompt: req.body.prompt,
        choices: {
            a1: req.body.a1,
            a2: req.body.a2,
            a3: req.body.a3,
            a4: req.body.a4
        },
        correctAnswer: req.body.correctAnswer,
        dateCreated: moment(),
        addedBy: req.body.addedBy,
        lessonURL: req.body.lessonURL
    });
    var newWord2 = new sentenceWord({
        prompt: req.body.prompt,
        choices: {
            a1: req.body.a4,
            a2: req.body.a3,
            a3: req.body.a2,
            a4: req.body.a1
        },
        correctAnswer: req.body.correctAnswer,
        dateCreated: moment(),
        addedBy: req.body.addedBy,
        lessonURL: req.body.lessonURL
    });
    var newWord3 = new sentenceWord({
        prompt: req.body.prompt,
        choices: {
            a1: req.body.a4,
            a2: req.body.a2,
            a3: req.body.a3,
            a4: req.body.a1
        },
        correctAnswer: req.body.correctAnswer,
        dateCreated: moment(),
        addedBy: req.body.addedBy,
        lessonURL: req.body.lessonURL
    });
    var newWord4 = new sentenceWord({
        prompt: req.body.prompt,
        choices: {
            a1: req.body.a1,
            a2: req.body.a3,
            a3: req.body.a2,
            a4: req.body.a4
        },
        correctAnswer: req.body.correctAnswer,
        dateCreated: moment(),
        addedBy: req.body.addedBy,
        lessonURL: req.body.lessonURL
    });
    console.log('Looking for possible duplicates of the word.');
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
    sentenceWord.findOne(
        //structured query to find if there is a entry of this already in the DB. prompt and answers are the only thing that matters
        {
            prompt: {
                $eq: req.body.prompt
            },
            "choices.a1": req.body.a1,
            "choices.a2": req.body.a2,
            "choices.a3": req.body.a3,
            "choices.a4": req.body.a4,
            correctAnswer: req.body.correctAnswer
        },
        function (err, data) {
            if (err) throw err;
            if (!data) {
                newWord1.save(function (err) {
                    if (err) throw err;
                    newWord2.save(function (errNewWord2) {
                        if (errNewWord2) throw errNewWord2;
                        newWord3.save(function (errNewWord3) {
                            if (errNewWord3) throw errNewWord3;
                            newWord4.save(function (errNewWord4) {
                                if (errNewWord4) throw errNewWord4;
                            });
                        });
                    });
                    var decoded = jwt.decode(token);
                    console.log(decoded.name);
                    User.updateOne({
                        name: req.body.addedBy
                    }, {
                        $inc: {
                            addedPoints: 1
                        }
                    }, function (err, data) {
                        if (err) throw err;
                        res.json({
                            status: 'Success!'
                        });
                    });
                });

            } else {
                console.log('Duplicate was found.');
                res.json({
                    status: false,
                    message: 'Data was already entered'
                });
            }
        });
});
router.get(`/find`, function (req, res) {
    console.log(req.query.prompt);
    sentenceWord.findOne({
        prompt: req.query.prompt,
        "choices.a1": req.query.a1,
        "choices.a2": req.query.a2,
        "choices.a3": req.query.a3,
        "choices.a4": req.query.a4
    }, function (err, data) {
        if (err) {
            throw err;
            res.status(500).json({
                err
            });
        }
        if (data) {
            var decoded = jwt.decode(token);
            var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
            User.updateOne({
                name: req.query.addedBy
            }, {
                $inc: {
                    availablePoints: config.weights.sentenceWordWeight * -1
                }
            }, function (err, dataUser) {
                console.log(err);
                if (err) throw err;
                console.log("Adding points to the user's profile");
                res.json({
                    answer: data.correctAnswer
                });
            });
        } else {
            res.json({
                error: 'SEW1'
            });
        }
    })
});
module.exports = router;