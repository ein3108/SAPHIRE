var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/simulatorlist', function(req, res, next) {
  var db = req.db;
  var collection = db.get('simulatorlist');
  collection.find({}, {}, function(e, docs) {
    res.json(docs);
  });
});

router.post('/addSimulator', function(req, res) {
  var db = req.db;
  var collection = db.get('simulatorlist');
  collection.insert(req.body, function(err, result) {
    res.send((err === null) ? { msg:'' } : { msg:err });
  });
});

router.delete('/deleteSimulator', function(req, res) {
  var db = req.db;
  var collection = db.get('simulatorlist');
  var simToDelete = req.body.id;
  collection.remove({ '_id':simToDelete }, function(err) {
    res.send((err === null) ? { msg:'' } : { msg:'Error ' + err });
  });
});

// How to pass 'microwave' from the database?
router.get('/microwave', function(req, res) {
  res.render('microwaveInit');
});

router.post('/microwave', function(req, res) {
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
