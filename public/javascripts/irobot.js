var saphireSocket= io.connect('http://127.0.0.1:4200', { forceNew: true });
/* Connection to SAPHIRE */
saphireSocket.on('connect', function(data) {
  saphireSocket.emit('join', 'iRobot');
});

saphireSocket.on('broad', function(data) {
  if (data === 'irobot:start' && $('#hiddenState').prop('value') === 'irobot:start') {
    document.getElementById('log').innerHTML = 'irobot:start';
    $('#hiddenState').prop('value', 'irobot:stop');
    $('#simBtn').prop('value', 'Stop the irobot');
    startIRobot();
  } else if (data === 'irobot:stop' && $('#hiddenState').prop('value') === 'irobot:stop') {
    document.getElementById('log').innerHTML = 'irobot:stop';
    $('#hiddenState').prop('value', 'irobot:start');
    $('#simBtn').prop('value', 'Start the irobot');
    stopIRobot();
  } else {
  }

  saphireSocket.emit('finish', 'iRobot state changed');
});

var simulate = function() {
  var state = $('#hiddenState').val();
  saphireSocket.emit('simulate', state);
};

/* Modify the IP address accordingly */
//var HOST = 'http://192.168.7.2:';
var HOST = 'ws://192.168.0.23:';
var PORT = 2222;

/* Connection to BeagleBone Black */
function startIRobot() {
  var socket = new WebSocket(HOST + PORT);
  socket.onopen = function() {
    socket.send('irobot:start');
  };

  socket.onclose = function() {
    //alert('connection closed');
  };
};

function stopIRobot() {
  var socket = new WebSocket(HOST + PORT);
  socket.onopen = function() {
    socket.send('irobot:stop');
  };

  socket.onclose = function() {
   // alert('connection closed');
  };
};

/*
function startIRobot() {
  var client = io.connect(HOST + PORT, 
      { forceNew: true }, function(data) {
    console.log('CONNECTED TO: ' + HOST + PORT);
    client.emit('simulate', 'irobot:start');
  });

  client.on('data', function(data) {    
    console.log('DATA: ' + data);
    client.end();
  });

  client.on('close', function() {
    console.log('Connection closed');
    client.destroy();
  });
};

function stopIRobot() {
  var client = io.connect(HOST + PORT, 
      { forceNew: true }, function(data) {
    console.log('CONNECTED TO: ' + HOST + PORT);
    client.emit('simulate', 'irobot:stop');
  });

  client.on('data', function(data) {    
    console.log('DATA: ' + data);
    client.end();
  });

  client.on('close', function() {
    console.log('Connection closed');
    client.destroy();
  });
};
*/
