var express = require('express');
var router = express.Router();
var sentenceWord = require('../DataModels/sentenceWord');
var User = require('../DataModels/user');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
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


router.post('/create', function (req, res, next) {
  var newSentence = new sentenceWord({
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
  var token = req.body.token || req.query.token || req.headers[`x-access-token`] || req.cookies.token;
  sentenceWord.findOne(
    //structured query to find if there is a entry of this already in the DB. prompt and answers are the only thing that matters
    {
      prompt: { $eq: req.body.prompt },
      "choices.a1": req.body.choices.a1,
      "choices.a2": req.body.choices.a2,
      "choices.a3": req.body.choicesa3,
      "choices.a4": req.body.choices.a4,
      correctAnswer: req.body.correctAnswer
    }
  ), function (err, data) {
    if (err) throw err;
    if (!data) {
      console.log(`Saving data! No duplicates found!`);
      newSentence.save(function (err) {
        if (err) throw err;
        console.log(`Data successfully saved!`);
        var decoded = jwt.decode(token);
        console.log(decoded.name);
        User.updateOne({ name: decoded.name }, { $inc: { addedPoints: 1 } }, function (err, data) {
          if (err) throw err;
          console.log("Adding points to the user's profile");
          res.send({ status: 'Success!' });
        });
      });
    }
  }
});

router.get(`/find`, function (req, res) {
  sentenceWord.findOne(
    {
      prompt: req.query.prompt,
      "choices.a1": req.query.a1,
      "choices.a2": req.query.a2,
      "choices.a3": req.query.a3,
      "choices.a4": req.query.a4
    }, function (err, data) {
      if (err){
        throw err;
        res.status(500).json({err});
      }
      if (data) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
        User.updateOne({ name: decoded.name }, { $inc: { availablePoints: config.weights.sentenceWordWeight * -1 } }, function (err, data) {
          res.JSON({ answer: data.correctAnswer });
        });
      } else {
        res.JSON({ error: 'SEW1' });
      }
    }
  )
});
module.exports = router;
