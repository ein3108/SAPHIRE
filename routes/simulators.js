var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/simulatorlist', function(req, res, next) {
  var db = req.db;
  var collection = db.get('appliancelist');
  collection.find({}, {}, function(e, docs) {
    res.json(docs);
  });
});

// How to pass 'microwave' from the database?
router.get('/microwave', function(req, res) {
  res.render('microwaveInit');
});

router.post('/mivrowave', function(req, res) {
  var state = req.body.state;
  if (state === 'init') {
    res.render('microwaveInit');
  } else if (state === 'start') {
    res.render('microwaveStart');
  } else {
  }
  res.end("success");
});

module.exports = router;
