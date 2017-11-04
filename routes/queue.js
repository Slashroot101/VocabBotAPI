var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Queue = require('../DataModels/queue');
var moment = require('moment');
var cookie = require('cookie');
var config = require('../config');
var User = require('../DataModels/user');
var promise = require('promise');
var util = require('util');
var MongoStream = require('mongo-watch');
const { spawn } = require('child_process');
var watcher = new MongoStream({format: 'normal', db: config.database, useMasterOplog:true});
// watch the collection
watcher.watch('VocabBot.queues', function(event) {
  // parse the results
  console.log(util.inspect(event, {showHidden: false, depth: null}));
  console.log(event.oplist[0].path);
  console.log(event.oplist[0].data);
    if(event.oplist[0].path ==='completionData.inProgress' && event.oplist[0].data === false){
        spawnBot();
    }
});



router.get('/currentTask', function (req, res) {
    Queue.find({
        "completionData.completed": false,
        "completionData.inProgress": false
    }, null, {
        sort: 'meta.timeDue',
        limit: 1
    }, function (err, data) {
        if (err) {
            res.status(500).json({
                err
            });
        }
        try{
            if (data[0]._id) {
                Queue.update({
                    _id: data[0]._id
                }, {
                    "completionData.inProgress": true
                }, function (err, data2) {
                    if (err) {
                        res.status(500).json(err);
                    }
                    res.json(data);
                })
            } else {
                res.status(500).json({
                    status: 'No data found'
                });
            }
        } catch (err){
            console.log(err);
        }


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

    router.post('/', function (req, res) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
        var decoded = jwt.decode(token);
        console.log(decoded);
        User.findOne({
            name: decoded.name
        }, function (err, data) {
            if (err) {
                res.status(500).json(err);
            } else {

                var newQueue = new Queue({
                    meta: {
                        timeQueued: moment(),
                        timeDue: moment(req.body.timeDue)
                    },
                    completionData: {
                        completed: false,
                        completePercent: 0,
                        inProgress: false
                    },
                    config: {
                        apiLogin: {
                            username: decoded.name,
                            password: data.password
                        },
                        user: {
                            username: req.body.user.username,
                            password: req.body.user.password
                        },
                        assignmentURL: req.body.assignmentURL
                    }
                });

                newQueue.save(function (err, data2) {
                    spawnBot();
                    if (err) {
                        res.status(500).json(err);
                    }
                    res.json(data2);

                });
            }
        });


    });


});




router.post('/completeTask/', function (req, res) {
    console.log(req.body);
    Queue.findOneAndUpdate({
        _id: req.body.id
    }, {
        "completionData.completed": true,
        "completionData.inProgress": false,
        "completionData.completePercent": req.body.completepercent
    }, function (err, data) {
        if (err) {
            throw err;
        } else {
            res.json(data);
        }
    });
});

function spawnBot(){
    console.log('Spawning the bot!');
    Queue.find(
        {
            "completionData.inProgress" : true,
        }, function(err, data){
            try {
                if(data){
                    return;
                } else {
                    const child = spawn('node', ['../VocabBot/cleaned.js']);
                    child.stdout.on('data', (data) => {
                        console.log(`child stdout:\n${data}`);

                      });
                      
                      child.stderr.on('data', (data) => {
                        console.error(`child stderr:\n${data}`);

                      });
                }
            } catch (err){
                res.status(500).json(err);
            }
        }
    );
}




module.exports = router;