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
            var token = jwt.sign({
              name: user.name
            }, String(config.secret), {
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
          res.redirect('/overview');
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




  router.get('/overview', function(req, res){

  });




module.exports = router;