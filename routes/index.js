var express = require('express');
var router = express.Router();
//var ip = require('ip').address();
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SAPHIRE', version: '1.0' });
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
