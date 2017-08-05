var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt  = require('jsonwebtoken');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var cookie = require('cookie');
var moment = require('moment');
var User = require('../DataModels/user');
var config = require('../config');
mongoose.connect(config.database);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/signup', function(req, res, next){
  console.log('Registering user!');
  //TODO: make an actual signup route
  var newUser = new User({
    name: 'sam41075',
    password: 'test',
    phonenumber: '5132992209',
    email: 'test@test.com',
    admin: true,
    addedPoints : 0
  });
  newUser.save(function(err){
    res.send('Saved successfully!');
    console.log('User saved successfully!');
  });
});

  router.post('/login', function(req, res) {
    console.log(req.body);
    User.findOne({
       name: req.body.username
     }, function(err, user) {
       if (err) throw err;

       if (!user) {
         res.send({success: false, msg: 'Authentication failed. User not found.'});
       } else {
         // check if password matches
         user.comparePassword(req.body.password, function (err, isMatch) {
           if (isMatch && !err) {
             // if user is found and password is right create a token
             var token = jwt.sign(user, String(config.secret), {
               expiresIn: 1440 // expires in 24 hours
             });
             // return the information including token as JSON
             res.json({token: token});
           } else {
             res.send({success: false, msg: 'Authentication failed. Wrong password.'});
           }
         });
       }
     });
  });




module.exports = router;
