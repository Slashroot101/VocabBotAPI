var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var queue = require('../DataModels/queue');
var moment = require('moment');


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

router.post('/queue', function(req, res){
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
    var decoded = jwt.decode(token);
    var newQueue = new queue({
        name: decoded.name,
        timeQueued: moment(),
        timeDue: moment(req.body.timeDue),
        completed: false,
        completePercent: 0
    });

    newQueue.save(function(err, data){
        if(err){
            res.status(500),json(err);
        }
        res.json(data);
    });
});




















module.exports = router;
