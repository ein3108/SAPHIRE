var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SAPHIRE' });
  //res.render('microwaveOn', {});
  next();
});

router.post('/', function(req, res, next) {
  /*
  var command = req.body.command;
  if (command == "start cooking") {
    res.render('microwaveOn');
  }
  */
  res.render('microwaveOn');
  res.send('success');
  next();
  console.log('POST request arrived');
});

module.exports = router;
