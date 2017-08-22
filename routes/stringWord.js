var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var cookie = require('cookie');
var moment = require('moment');
var config = require('../config');
var stringWord = require('../DataModels/stringWord');
var User = require('../DataModels/user');
mongoose.connect(config.database);
router.use(express.static(__dirname + '/public'));
router.use(express.static('./public/home'));
router.use(bodyParser());
router.get('/', function (req, res, next) {
    res.send("Hello! The API is responding at localhost:3000!");
});


//route middlware to verify token
router.use(function (req, res, next) {
    console.log(req.body);
    let cookies = cookie.parse(req.headers.cookie || '');
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                console.log(req.query.token);
                return res.json({ success: false, message: 'Failed to authenticate token.' });
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
        res.json({ success: false, error: 'Token not provided or a bad token was provided. Please login and retry.' });
    }
});

/*
router.use(function(req, res, next){
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
    var decoded = jwt.decode(token);
    console.log(decoded);
    User.findOne({
        name: decoded.name
    }, function(err, data){
        console.log(data);
        if(err) {
            res.status(500).json({success: false, error: err});
        }
        if(data.availablePoints >= config.weights.stringWordWeight || data.admin){
            next();
        } else {
            res.json({success: false, error: 'Not enough points available, please buy more points or teach the bot new words to gain more.'});
        }
    });
}); */

router.use(function(req, res, next){
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
    var decoded = jwt.decode(token);
    console.log(decoded.name);
    User.findOne({
        name: decoded.name
    }, function(err, data){
        if(err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: err
            });
        }
        if(data.availablePoints >= config.weights.stringWordWeight || data.admin){
            next();
        } else {
            res.json({success: false, error: 'Not enough points available, please buy more points or teach the bot new words to gain more.'});
        }
        //console.log(data);
    });
});


//saves a stringWord if one doesn't already exist matching it, if it does, it skips saving it, and does not reward any points
router.post('/create', function (req, res, next) {
    console.log(`Posting string word!`);
    var newWord1 = new stringWord({
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
    var newWord2 = new stringWord({
        prompt: req.body.prompt,
        choices: {
            a1: req.body.a4,
            a2: req.body.a1,
            a3: req.body.a2,
            a4: req.body.a3
        },
        correctAnswer: req.body.correctAnswer,
        dateCreated: moment(),
        addedBy: req.body.addedBy,
        lessonURL: req.body.lessonURL
    });
    var newWord3 = new stringWord({
        prompt: req.body.prompt,
        choices: {
            a1: req.body.a2,
            a2: req.body.a3,
            a3: req.body.a4,
            a4: req.body.a1
        },
        correctAnswer: req.body.correctAnswer,
        dateCreated: moment(),
        addedBy: req.body.addedBy,
        lessonURL: req.body.lessonURL
    });
    var newWord4 = new stringWord({
        prompt: req.body.prompt,
        choices: {
            a1: req.body.a3,
            a2: req.body.a4,
            a3: req.body.a1,
            a4: req.body.a2
        },
        correctAnswer: req.body.correctAnswer,
        dateCreated: moment(),
        addedBy: req.body.addedBy,
        lessonURL: req.body.lessonURL
    });
    console.log('Looking for possible duplicates of the word.');
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
    stringWord.findOne(
        //structured query to find if there is a entry of this already in the DB. prompt and answers are the only thing that matters
        {
            prompt: { $eq: req.body.prompt },
            "choices.a1": req.body.a1,
            "choices.a2": req.body.a2,
            "choices.a3": req.body.a3,
            "choices.a4": req.body.a4,
            correctAnswer: req.body.correctAnswer
        }, function (err, data) {
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
                    User.updateOne({ name: decoded.name }, { $inc: { addedPoints: 1 } }, function (err, data) {
                        if (err) throw err;
                        res.json({ status: 'Success!' });
                    });
                });

            } else {
                console.log('Duplicate was found.');
                res.json({ status: false, message: 'Data was already entered' });
            }
        });
});
//simple route to find the answer to a question, and if it cannot be found, tells the client to learn the word and send it to the DB to learn
router.get('/find', function (req, res, next) {
    console.log(req.query);
    stringWord.findOne(
        {
            prompt: req.query.prompt,
            "choices.a1": req.query.a1,
            "choices.a2": req.query.a2,
            "choices.a3": req.query.a3,
            "choices.a4": req.query.a4
            //in this case, we cannot query for correct answer, because they will not have that data available when answering the question
        }, function (err, data) {
            if (err) throw err;
            if (data) {
                var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
                var decoded = jwt.decode(token);
                User.updateOne({ name: decoded.name }, { $inc: { availablePoints: config.weights.stringWordWeight * -1 } }, function (err, data) {
                    console.log(err);
                    if (err) throw err;
                    console.log("Adding points to the user's profile");
                    res.json({ answer: data.correctAnswer });
                });
            } else {
                res.json({ error: 'SW1' })
            }
        }
    );
});


module.exports = router;
