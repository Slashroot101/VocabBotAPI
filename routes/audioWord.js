var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var cookie = require('cookie');
var moment = require('moment');
var config = require('../config');
var audioWord = require('../DataModels/audioWord');
var User = require('../DataModels/user');
router.use(express.static(__dirname + '/public'));
router.use(express.static('./public/home'));
router.use(bodyParser());



router.get('/', function (req, res, next) {
    res.send("Hello! The API is responding at localhost:3000!");
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
        if(data.availablePoints >= config.weights.audioWordWeight || data.admin){
            next();
        } else {
            res.json({success: false, error: 'Not enough points available, please buy more points or teach the bot new words to gain more.'});
        }
        //console.log(data);
    });
});

//simple route to find the answer to a question, and if it cannot be found, tells the client to learn the word and send it to the DB to learn
router.get('/find', function (req, res, next) {
    audioWord.findOne(
        {
            prompt: req.query.prompt
            //in this case, we cannot query for correct answer, because they will not have that data available when answering the question
        }, function (err, data) {
            if (err) throw err;
            if (data) {
                var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
                User.updateOne({ name: req.body.addedBy }, { $inc: { availablePoints: config.weights.audioWordWeight * -1 } }, function (err, data) {
                    if (err) throw err;
                    console.log("Adding points to the user's profile");
                    res.json({ answer: data.answer });
                });
            } else {
                res.json({ error: 'AW1' })
            }
        }
    );
});

router.post('/create', function (req, res, next) {
    var newWord = new audioWord({
        prompt: req.body.prompt,
        correctAnswer: req.body.correctAnswer,
        dateCreated: moment(),
        addedBy: req.body.addedBy,
        lessonURL: req.body.lessonURL
    });
    console.log('Looking for possible duplicates of the word.');
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
    audioWord.findOne(
        //structured query to find if there is a entry of this already in the DB. prompt and answers are the only thing that matters
        {
            prompt: { $eq: req.body.prompt },
            correctAnswer: req.body.correctAnswer
        }, function (err, data) {
            if (err) throw err;
            if (!data) {
                console.log('Saving data! No duplicates found!');
                newWord.save(function (err) {
                    if (err) throw err;
                    console.log('Data successfuly saved!');
                    User.updateOne({ name: req.body.addedBy }, { $inc: { addedPoints: 1 } }, function (err, data) {
                        if (err) throw err;
                        console.log("Adding points to the user's profile");
                        res.json({ status: 'Success!' });
                    });
                });
            } else {
                console.log('Duplicate was found.');
                res.json({ status: false, message: 'Data was already entered' });
            }
        });
});
module.exports = router;