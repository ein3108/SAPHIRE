var socket = io.connect('http://127.0.0.1:4200');
//var socket = io.connect('http://ec2-52-25-254-206.us-west-2.compute.amazonaws.com:4200');

// The timeout value has to be pulled from the database
var cookTime;

socket.on('connect', function(data) {
  socket.emit('join', 'simulators');
});

socket.on('broad', function(data) {
  if (data === 'microwave:init') {
    $('#').prop('src', '/images/microwaveoff.jpg');
    $('#simBtn1').prop('value', 'Start the microwave');
    $('#microwaveHiddenState').prop('value', 'microwave:start');
  } else if (data === 'microwave:start') {
    $('#').prop('src', '/images/microwaveon.jpg');
    $('#simBtn1').prop('value', 'Stop the microwave');
    $('#microwaveHiddenState').prop('value', 'microwave:init');

    setTimeout(simulate, cookTime);
  } else if (data === 'fridge:egg') {
    // search the database and send the response to GlassHouse
  } else if (data === 'fridge:bacon') { 
    // search the database and send the response to GlassHouse
  } else if (data === 'light:stop') { 
    $('#').prop('src', '/images/lampoff.jpg');
    $('#simBtn4').prop('value', 'Turn on the light');
    $('#lightHiddenState').prop('value', 'light:start');
  } else if (data === 'light:start') { 
    $('#').prop('src', '/images/lampon.jpg');
    $('#simBtn4').prop('value', 'Turn off the light');
    $('#lightHiddenState').prop('value', 'light:stop');
  } else if (data === 'roomba:stop') { 
    $('#').prop('src', '/images/irobot.jpg');
    $('#simBtn5').prop('value', 'Start the roomba');
    $('#irobotHiddenState').prop('value', 'roomba:start');
  } else if (data === 'roomba:start') { 
    $('#').prop('src', '/images/irobot.gif');
    $('#simBtn5').prop('value', 'Stop the roomba');
    $('#irobotHiddenState').prop('value', 'roomba:stop');
    // For how long does iRobot run?
    setTimeout(simulate, 3000); 
  } else if (data === 'washer:stop') { 
    $('#').prop('src', '/images/washeroff.jpg');
    $('#simBtn3').prop('value', 'Start the washer');
    $('#washerHiddenState').prop('value', 'washer:start');
  } else if (data === 'washer:start') { 
    $('#').prop('src', '/images/washer.gif');
    $('#simBtn3').prop('value', 'Start the washer');
    $('#washerHiddenState').prop('value', 'washer:stop');

    //For how long does washer run?
    setTimeout(simulate, 10000);
  } else {
  }

  socket.emit('finish', 'Simulator state changed');

});


var simulate = function() {
  var state = $('').val();
  socket.emit('simulate', state);
};

