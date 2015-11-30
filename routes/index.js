var express = require('express');
var router = express.Router();
//var ip = require('ip').address();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SAPHIRE', version: '1.0' });
//  res.json(ip);
});

module.exports = router;
