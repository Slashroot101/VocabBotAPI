var express = require('express');
var router = express.Router();

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
                    completionMessage: '',
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





module.exports = router;