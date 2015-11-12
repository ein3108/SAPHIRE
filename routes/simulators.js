var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('appliancelist');
  collection.find({}, function(e, docs) {
    res.json(docs);
  });
});

router.post('/simulators', function(req, res) {
  res.render('microwaveSimulator');
});

module.exports = router;
