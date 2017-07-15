var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var audioWord = new Schema({
    sentence: String,
    correctAnswer: String,
    dateCreated: Date(),
    addedBy: String,
    lessonURL: String
});
//simple route to find the answer to a question, and if it cannot be found, tells the client to learn the word and send it to the DB to learn
router.get('/find', function (req, res, next) {
    stringWord.findOne(
        {
            prompt: req.query.prompt
            //in this case, we cannot query for correct answer, because they will not have that data available when answering the question
        }, function (err, data) {
            if (err) throw err;
            if (data) {
                res.JSON({ answer: data.correctAnswer });
            } else {
                res.JSON({ error: 'SW1' })
            }
        }
    );
});

router.post('/create', function (req, res, next) {
    var newWord = new audioWord({
        prompt: req.body.prompt,
        correctAnswer: req.body.correctAnswer,
        dateCreated: moment(),
        addedBy: req.body.addedBy,
        lessonURL: req.body.lessonURL
    });
    console.log('Looking for possible duplicates of the word.');
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
    stringWord.findOne(
        //structured query to find if there is a entry of this already in the DB. prompt and answers are the only thing that matters
        {
            prompt: { $eq: req.body.prompt },
            correctAnswer: req.body.correctAnswer
        }, function (err, data) {
            if (err) throw err;
            if (!data) {
                console.log('Saving data! No duplicates found!');
                newWord.save(function (err) {
                    if (err) throw err;
                    console.log('Data successfuly saved!');
                    var decoded = jwt.decode(token);
                    console.log(decoded.name);
                    User.updateOne({ name: decoded.name }, { $inc: { addedPoints: 1 } }, function (err, data) {
                        if (err) throw err;
                        console.log("Adding points to the user's profile");
                        res.JSON({ status: 'Success!' });
                    });
                });
            } else {
                console.log('Duplicate was found.');
                res.JSON({ status: false, message: 'Data was already entered' });
            }
        });
});

module.exports = mongoose.model('AudioWord', AudioWord);