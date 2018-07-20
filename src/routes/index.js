var express = require('express');
var router = express.Router();
let User = require(`../libs/user`);
/* GET home page. */
router.get('/', function(req, res, next) {
  User.create();
});

module.exports = router;
