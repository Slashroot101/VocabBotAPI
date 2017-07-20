var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var cookie = require('cookie');
var moment = require('moment');
var config = require('../config');
var jimp = require(`jimp`);
var stringWord = require('../DataModels/imageWord');
var User = require('../DataModels/user');

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


router.post(`/create`,function(req, res){
    var newWord = new stringWord({
        prompt: req.body.prompt,
        choices: {
            a1: req.body.a1,
            a2: req.body.a2,
            a3: req.body.a3,
            a4: req.body.a4
        },
        correctAnswer: req.body.correctAnswer,
        dateCreated: req.body.dateCreated,
        addedBy: req.body.addedBy,
        lessonURL: req.body.lessonURL
    });

    newWord.save(function(err, data){
      if(err) throw err;
      if(data) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
        User.updateOne({ name: decoded.name }, { $inc: { availablePoints: config.weights.imageWordWeight * -1 } }, function (err, data) {
          res.JSON({ answer: data.correctAnswer });
        });
      } else {
        res.JSON({error: `IW1`})
      }
    });
});

router.get(`/find`, function(req, res){
  imageWord.fineOne(
    {
      prompt: req.query.prompt,
      "choices.a1": req.query.a1,
      "choices.a2": req.query.a2,
      "choices.a3": req.query.a3,
      "choices.a4": req.query.a4,
    }, function(err, data){
      if(err) throw err;
      if(data) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
        User.updateOne({ name: decoded.name }, { $inc: { availablePoints: config.weights.imageWordWeight * -1 } }, function (err, data) {
          res.JSON({ answer: data.correctAnswer });
        });
      }
    }
  )
});