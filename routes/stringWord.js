var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt  = require('jsonwebtoken');
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

//saves a stringWord if one doesn't already exist matching it, if it does, it skips saving it, and does not reward any points
router.post('/create', function(req, res, next){
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
    console.log(req.body);
    console.log('Looking for possible duplicates of the word.');
    stringWord.findOne(
        //structured query to find if there is a entry of this already in the DB. prompt and answers are the only thing that matters
        
                {
                    prompt : { $eq : req.body.prompt},
                    a1 : req.body.a1,
                    a2 : req.body.a2,
                    a3 : req.body.a3,
                    a4 : req.body.a4,
                    correctAnswer : req.body.correctAnswer

                } , function(err, data){
                    if(err) throw err;
                    console.log(data);
                    if(!data){
                        console.log('Saving data! No duplicates found!');
                        newWord.save(function(err){
                            if(err) throw err;
                            console.log('Data successfuly saved!');
                            var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
                            //TODO: award points to the user for teaching the bot new word
                            var decoded =  jwt.decode(token);
                            console.log(decoded.name);
                            User.updateOne({name : decoded.name},{$inc : {addedPoints : 1}}, function(err, data){
                                if(err) throw err;
                                console.log("Adding points to the user's profile");
                            });
                        });
                    } else {
                        console.log('Duplicate was found.')
                    }
                });
            });

module.exports = router;
