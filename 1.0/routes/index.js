var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var cookie = require('cookie');
var moment = require('moment');
var User = require('../DataModels/user');
var config = require('../config');
mongoose.connect(config.database);
/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile(process.cwd()+'/views/index.html');
});


router.get('/signup', function (req, res, next) {
  console.log('Registering user!');
  //TODO: make an actual signup route
  var newUser = new User({
    name: 'sam41075',
    password: 'test',
    email: 'test@test.com',
    admin: true,
    role: 'Super Admin',
    addedPoints: 0,
    availablePoints: 0,
    numQuestionsAnswered: 0,
    lastUse: moment(),
    dateJoined: moment()
  });
  newUser.save(function (err) {
    res.send('Saved successfully!');
    console.log('User saved successfully!');
  });
});

router.post('/login', function (req, res) {
  console.log(req.body);
  User.findOne({
    name: req.body.name
  }, function (err, user) {
    if (err) throw err;

    if (!user) {
      res.send({
        success: false,
        msg: 'Authentication failed. User not found.'
      });
    } else {
      // check if password matches
      User.findOne(
        {
          password : req.body.password
        }, function(err, data){
          if(err){
            res.status(500).json(err);
          } else {
            var token = jwt.sign(user, String(config.secret), {
              expiresIn: 1440 // expires in 24 hours
            });
            res.json({token: token});
          }
        }
      );
    }
  });
});

router.post('/frontLogin', function (req, res) {
  console.log(req.body.username);
  User.findOne({
    name: req.body.username
  }, function (err, user) {
    if (err) throw err;

    if (!user) {
      res.send({
        success: false,
        msg: 'Authentication failed. User not found.'
      });
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user, String(config.secret), {
            expiresIn: 1440 // expires in 24 hours
          });
          // return the information including token as JSON
          res.cookie('token', token, {
            maxAge: 900000,
            httpOnly: true
          });
          res.redirect('/startAssignment');
        } else {
          res.send({
            success: false,
            msg: 'Authentication failed. Wrong password.'
          });
        }
      });
    }
  });
});





  router.get('/startAssignment', function(req, res){
    res.sendFile(process.cwd() + '/views/startAssignment.html');
  });




module.exports = router;