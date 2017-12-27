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
const {
    exec
} = require('child_process');
var watcher = new MongoStream({
    format: 'normal',
    db: config.database,
    useMasterOplog: true
});
// watch the collection
watcher.watch('VocabBot.queues', function (event) {
    // parse the results
    console.log(util.inspect(event, {
        showHidden: false,
        depth: null
    }));
    console.log(event.oplist[0].path);
    console.log(event.oplist[0].data);
    if (event.oplist[0].path === 'completionData.inProgress' && event.oplist[0].data === false) {
        spawnBot();
    }
});

router.get('/test', function(req, res){
    res.send('test');
});

router.get('/currentTask', function (req, res) {
    console.log('Getting current task!');
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
        if (typeof data[0]._id !== undefined) {
            Queue.update({
                _id: data[0]._id
            }, {
                "completionData.inProgress": true
            }, function (err, data2) {
                if (err) {
                    res.status(500).json(err);
                }
                res.json(data);
            });
        } else {
            res.status(500).json({
                status: 'No data found'
            });
        }
    });
});


//route middlware to verify token
router.use(function (req, res, next) {
    console.log('Checking middleware functions in queue!');
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
    console.log(req.decoded._doc.name);
    User.findOne({
        name: req.decoded._doc.name
    }, function (err, data) {
        console.log('Data: \n' + data);
        if (err) {
            console.log(err);
            res.status(500).json({
                msg: "There was an error creating your queue."
            });
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
                        username: data.name,
                        password: data.password
                    },
                    user: {
                        username: req.body.username,
                        password: req.body.password
                    },
                    assignmentURL: req.body.assignmentURL
                }
            });

            newQueue.save(function (err, data2) {
                if (err) {
                    res.status(500).json(err);
                } else {
                    spawnBot();
                    res.json(data2);
                }


            });
        }
    });


});







router.post('/completeTask/', function (req, res) {
    console.log(req.body);
    try {

        Queue.findOneAndUpdate({
            _id: req.body.id
        }, {
            "completionData.completed": true,
            "completionData.inProgress": false,
            "completionData.completePercent": req.body.completepercent
        }, function (err, data) {
            if (err) {
                res.end();
            } else {
                spawnBot();
                res.json(data);
            }
        });
    } catch (err) {
        res.end();
    }

});

function spawnBot() {
    console.log('Spawning the bot!');
    Queue.find({
        "completionData.inProgress": true,
    }, function (err, data) {
        try {
            exec('node ../VocabBot/cleaned.js', function (error, stdout, stderr) {
                console.log('stdout: ', stdout);
                console.log('stderr: ', stderr);
                if (error !== null) {
                    console.log('exec error: ', error);
                    return;
                }
            });
        } catch (err) {
            console.log(err);
            return;
        }
    });
}




module.exports = router;