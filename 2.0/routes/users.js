var express = require('express');
var router = express.Router();
var User = require('../Models/user');
var moment = require('moment');


router.get('/:id', function(req, res){
    User.findOne(
      {
        _id: new MongoId(req.params.id)
      }, function(err, data){
        if(err){
          return res.status(500).json(
            {
              success: false,
              err: err
            }
          )
        } else {
          if(data){
            return res.json(
              {
                success: true,
                data: data
              }
            );
          } else {
            return res.json(
              {
                success: false,
                msg: "No data found"
              }
            );
          }
        }
      }
    );
  }
);



router.post('/new', function(req, res){
    var newUser = new User(
      {
        authenticators: {
          username: req.body.authenticators.username,
          password: req.body.authenticators.password
        },
        contact: {
          email: req.body.contact.email
        },
        permission: {
          role: 'Client'
        },
        points: {
          currentPointsAvailable: 0,
          totalBoughtPoints: 0,
          totalSpendPoints: 0,
          pointPurchaseHistory: [
            {
              date: moment(),
              amount: 10,
              addedBy: "slashroot"
            }
          ]
        },
        meta: {
          totalQuestionsAnswered: 0,
          totalQuestionsLearned: 0,
          dateJoined: moment(),
          lessonHistory: [
            {
              url: 'slashroot'
            }
          ]
        }
      }
    );

    newUser.save(function(err, data){
        if(err){
          return res.status(500).json(
            {
              success: false,
              err: err
            }
          );
        } else {
          return res.json(
            {
              sucess: true,
              data: data
            }
          );
        }
      }
    );
  }
);





/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
