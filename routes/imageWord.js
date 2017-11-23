var express = require('express');
var router = express.Router();
var imageWord = require('../DataModels/imageWord');
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
    if (data.availablePoints >= config.weights.imageWordWeight || data.admin) {
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
  console.log(req.body);
  var newSentence1 = new imageWord({
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
  var newSentence2 = new imageWord({
    prompt: req.body.prompt,
    choices: {
      a1: req.body.a1,
      a2: req.body.a2,
      a3: req.body.a4,
      a4: req.body.a3
    },
    correctAnswer: req.body.correctAnswer,
    dateCreated: moment(),
    addedBy: req.body.addedBy,
    lessonURL: req.body.lessonURL
  });
  var newSentence3 = new imageWord({
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
  var newSentence4 = new imageWord({
    prompt: req.body.prompt,
    choices: {
      a1: req.body.a1,
      a2: req.body.a3,
      a3: req.body.a4,
      a4: req.body.a2
    },
    correctAnswer: req.body.correctAnswer,
    dateCreated: moment(),
    addedBy: req.body.addedBy,
    lessonURL: req.body.lessonURL
  });
  
  

  var token = req.body.token || req.query.token || req.headers[`x-access-token`] || req.cookies.token;
  imageWord.findOne(
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
        console.log(`Saving data! No duplicates found!`);
        newSentence1.save(function (err) {
          if (err) throw err;
          console.log(`Data successfully saved!`);
          var decoded = jwt.decode(token);
          newSentence2.save(function (err2) {
            console.log(err2);
            newSentence3.save(function (err3) {
              console.log(err3);
              newSentence4.save(function (err4) {
                console.log(err4);
                User.updateOne({
                  name: req.body.addedBy
                }, {
                  $inc: {
                    addedPoints: 1
                  }
                }, function (err, data) {
                  if (err) throw err;
                  console.log("Adding points to the user's profile");
                  res.send({
                    status: 'Success!'
                  });
                });
              });
            });
          });
        });
      }
    }
  )
});

router.get(`/find`, function (req, res) {
  console.log(req.query.prompt);
  imageWord.findOne({
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
        name: req.body.addedBy
      }, {
        $inc: {
          availablePoints: config.weights.imageWordWeight * -1
        }
      }, function (err, dataUser) {
        res.json({
          answer: data.correctAnswer
        });
      });
    } else {
      res.json({
        error: 'SEW1'
      });
    }
  });
});
module.exports = router;