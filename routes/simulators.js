var express = require('express');
var router = express.Router();
//var app = require('express')();
//var app = express();
//var app = express().createServer();
//var http = require('http').Server(app);
//var io = require('socket.io')(http);
//var ip = require('ip').address();


/* GET users listing. */
router.get('/simulatorlist', function(req, res, next) {
  var db = req.db;
  var collection = db.get('simulatorlist');
  collection.find({}, {}, function(e, docs) {
    res.json(docs);
  });
});

router.get('/microwave', function(req, res) {
  res.render('microwave');
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

/*
io.on('connection', function(socket) {
  console.log('a client connected');
  socket.on('simulate', function(data) {
    io.emit('broad', data);
  });
});
*/
//http.listen(4200);

module.exports = router;
