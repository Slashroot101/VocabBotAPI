var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt  = require('jsonwebtoken');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var cookie = require('cookie');
var moment = require('moment');
var stringWord = require('../DataModels/stringWord');
mongoose.createConnection(config.database);
router.use(express.static(__dirname + '/public'));
router.use(express.static('./public/home'));
router.use(expressSession({secret:config.secret}));
router.use(bodyParser());
router.get('/', function(req,res,next){
  res.send("Hello! The API is responding at localhost:3000!");
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

router.post('/stringword/create', function(req, res, next){
    var newWord = new stringWord({
        prompt : req.body.prompt,
        choices : {
            a1 : req.body.a1,
            a2 : req.body.a2,
            a3 : req.body.a3,
            a4 : req.body.a4
        },
        correctAnswer : req.body.correctAnswer,
        dateCreated : req.body.dateCreated,
        addedBy : req.body.addedBy,
        lessonURL : req.body.lessonURL
    });
    //TODO: search for documents to see if this object already exists, if it does, do not insert the document, if it doesn't, insert the document
  stringWord.findOne(newWord, function())   
});

