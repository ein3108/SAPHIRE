var express = require('express');
var router = express.Router();
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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

router.get('/refrigerator', function(req, res) {
  res.render('refrigerator');
});

router.get('/washer', function(req, res) {
  res.render('washer');
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

io.on('connection', function(socket) {
  console.log('on.connection: a client connected');

  socket.on('join', function(data) {
    console.log('on.join: a ' + data + ' connected');
  });

  socket.on('simulate', function(data) {
    io.emit('broad', data);
  });

  socket.on('finish', function(data) {
    console.log('finishing up the simulation:', data);
  });
});

http.listen(4200);

module.exports = router;
