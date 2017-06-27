var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt  = require('jsonwebtoken');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var cookie = require('cookie');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//easy login route to verify bot use
router.post('/login', function(res, res, next){
  User.findOne({
       username: req.body.username
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
             res.cookie('token', token, { maxAge: 900000, httpOnly: true });
             res.redirect('/home');
           } else {
             res.send({success: false, msg: 'Authentication failed. Wrong password.'});
           }
         });
       }
     });
});

//route middlware to verify token
router.use(function(req, res, next) {
  let cookies = cookie.parse(req.headers.cookie || '');
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
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
    res.json({error : 'Token not provided or a bad token was provided. Please login and retry.'});
  }
});


module.exports = router;
