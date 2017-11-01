var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Queue = require('../DataModels/queue');
var moment = require('moment');
var cookie = require('cookie');
var config = require('../config');
var User = require('../DataModels/user');
var promise = require('promise');
const mongoWatch = require('mongo-watch')
const watcher = mongoWatch({
    format: 'pretty'
})

// watch the collection 
watcher.watch('test.users', event => {
    // parse the results 
    console.log('something changed:', event);
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
        if (data) {
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
                    if (err) {
                        res.status(500).json(err);
                    }
                    res.json(data2);

                });
            }
        });


    });


});




router.get('/completeTask/:id', function (req, res) {
    Queue.findOneAndUpdate({
        _id: req.params.id
    }, {
        "completionData.complete": true,
        "completionData.inProgress": false,
        "completionData.completePercemt": req.body.completepercecnt
    }, function (err, data) {
        if (err) {
            throw err;
        } else {
            res.json(data);
        }
    });
});




module.exports = router;