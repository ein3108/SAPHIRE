var socket = io.connect('http://127.0.0.1:4200');
//var socket = io.connect('http://ec2-52-25-254-206.us-west-2.compute.amazonaws.com:4200');

// The timeout value has to be pulled from the database
var cookTime = 3000;
var HOST = 'ws://192.168.0.23:';
var PORT = 2222;

socket.on('connect', function(data) {
  socket.emit('join', 'simulators');
});

socket.on('broad', function(data) {
  if (data === 'microwave:init') {
    $('#microwaveImg').prop('src', '/images/Microwave.jpg');
    $('#simBtn1').prop('value', 'Start the microwave');
    $('#microwaveHiddenState').prop('value', 'microwave:start');

    socket.emit('finish', 'Microwave cooking completed');
  } else if (data === 'microwave:start') {
    $('#microwaveImg').prop('src', '/images/microwaveOn.jpg');
    $('#simBtn1').prop('value', 'Stop the microwave');
    $('#microwaveHiddenState').prop('value', 'microwave:init');

    setTimeout(simulateMicrowave, cookTime);
  } else if (data === 'fridge:egg') {
    // search the database and send the response to GlassHouse
    socket.emit('finish', 'There are 4 eggs in the refrigerator');
  } else if (data === 'fridge:bacon') { 
    // search the database and send the response to GlassHouse
    socket.emit('finish', 'There is roughly 6 slices of bacon left in the refrigerator');
  } else if (data === 'light:stop') { 
    $('#lightImg').prop('src', '/images/TableLamp.jpg');
    $('#simBtn4').prop('value', 'Turn on the light');
    $('#lightHiddenState').prop('value', 'light:start');
    socket.emit('finish', 'Light\' off');
  } else if (data === 'light:start') { 
    $('#lightImg').prop('src', '/images/TableLampOn.jpg');
    $('#simBtn4').prop('value', 'Turn off the light');
    $('#lightHiddenState').prop('value', 'light:stop');
    socket.emit('finish', 'Light\' on');
  } else if (data === 'roomba:stop') { 
    $('#irobotImg').prop('src', '/images/Roomba.jpg');
    $('#simBtn5').prop('value', 'Start the roomba');
    $('#irobotHiddenState').prop('value', 'roomba:start');
    socket.emit('finish', 'Roomba finished cleaning');
  } else if (data === '\"roomba:start\"') { 
    $('#irobotImg').prop('src', '/images/irobot.gif');
    $('#simBtn5').prop('value', 'Stop the roomba');
    $('#irobotHiddenState').prop('value', 'roomba:stop');
    // For how long does iRobot run?
    startIRobot();
    setTimeout(simulateIRobot, 3000); 
  } else if (data === 'washer:stop') { 
    $('#washerImg').prop('src', '/images/Washer.jpg');
    $('#simBtn3').prop('value', 'Start the washer');
    $('#washerHiddenState').prop('value', 'washer:start');
    socket.emit('finish', 'Laundry done');
  } else if (data === 'washer:start') { 
    $('#washerImg').prop('src', '/images/washer.gif');
    $('#simBtn3').prop('value', 'Start the washer');
    $('#washerHiddenState').prop('value', 'washer:stop');

    //For how long does washer run?
    setTimeout(simulateWasher, 10000);
  } else {
  }

});

var simulateMicrowave = function() {
  var state = $('#microwaveHiddenState').val();
  socket.emit('simulate', state);
};

var simulateWasher = function() {
  var state = $('#washerHiddenState').val();
  socket.emit('simulate', state);
};

var simulateLight = function() {
  var state = $('#lightHiddenState').val();
  socket.emit('simulate', state);
};

var simulateRefrigerator = function() {
  var state = $('#refrigeratorHiddenState').val();
  socket.emit('simulate', state);
};

var simulateIRobot = function() {
  var state = $('#irobotHiddenState').val();
  socket.emit('simulate', state);
};

function startIRobot() {
  var socket = new WebSocket(HOST + PORT);
  socket.onopen = function() {
    socket.send('irobot:start');
  };

  socket.onclose = function() {

  };
};
