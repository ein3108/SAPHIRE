//var socket = io.connect('http://ec2-52-25-254-206.us-west-2.compute.amazonaws.com:4200');
var socket = io.connect('http://127.0.0.1:4200');

socket.on('connect', function(data) {
  socket.emit('join', 'microwave');
});

socket.on('broad', function(data) {
  //document.getElementById('state').innerHTML = data;

  if (data === 'microwave:init') {
    $('#simImgContainer').prop('src', '/images/microwaveOff.jpg');
    $('#simBtn').prop('value', 'Start the microwave');
    $('#hiddenState').prop('value', 'microwave:start');

  } else if (data === 'microwave:start') {
    $('#simImgContainer').prop('src', '/images/microwaveOn.jpg');
    $('#simBtn').prop('value', 'Stop the microwave');
    $('#hiddenState').prop('value', 'microwave:init');

    setTimeout(simulate, 3000);
  } else {
  }

  socket.emit('finish', 'Microwave state changed');
});

var simulate = function() {
  var state = $('#hiddenState').val();
  socket.emit('simulate', state);
};
