var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use(function(req,res,next){
  if(req.query.category === 'test'){
    next();
  }
});

router.get('/test', function(req,res,next){
  console.log(req.query.yes);
});

module.exports = router;
