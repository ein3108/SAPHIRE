//var socket = io.connect('http://ec2-52-25-254-206.us-west-2.compute.amazonaws.com:4200');
var socket = io.connect('http://127.0.0.1:4200');

socket.on('connect', function(data) {
  socket.emit('join', 'washer');
});

/* State transition:
 * simBtn2 always transitions away from the initial state
 * and simBtn1 always transitions toward the initial state
 */

socket.on('broad', function(data) {
  //document.getElementById('state').innerHTML = data;
  
  if (data === 'washer:emptyClosed') {
    $('#simBtn1').prop('value', '');
    $('#simBtn2').prop('value', 'Open the door');
    $('#hiddenState1').prop('value', 'washer:emptyClosed');
    $('#hiddenState2').prop('value', 'washer:emptyOpened');
    $('#simImgContainer').prop('src', '/images/washerEmptyClosed.png');
  } else if (data === 'washer:emptyOpened') {
    $('#simBtn1').prop('value', 'Close the door');
    $('#simBtn2').prop('value', 'Put in the clothes');
    $('#hiddenState1').prop('value', 'washer:emptyClosed');
    $('#hiddenState2').prop('value', 'washer:stuffedOpened');
    $('#simImgContainer').attr('src', '/images/washerEmptyOpen.png');
  } else if (data === 'washer:stuffedOpened') {
    $('#simBtn1').prop('value', 'Take out the clothes');
    $('#simBtn2').prop('value', 'Close the door');
    $('#hiddenState1').prop('value', 'washer:emptyOpened');
    $('#hiddenState2').prop('value', 'washer:stuffedClosed');
    $('#simImgContainer').attr('src', '/images/washerOpen.png');
  } else if (data === 'washer:stuffedClosed') {
    $('#simBtn1').prop('value', 'Open the door');
    $('#simBtn2').prop('value', 'Start running');
    $('#hiddenState1').prop('value', 'washer:stuffedOpened');
    $('#hiddenState2').prop('value', 'washer:running');
    $('#simImgContainer').attr('src', '/images/washerFullClosed.png');
  } else if (data === 'washer:running') {
    $('#simBtn1').prop('value', 'Stop the washer');
    $('#simBtn2').prop('value', '');
    $('#hiddenState1').prop('value', 'washer:stuffedClosed');
    $('#hiddenState2').prop('value', 'washer:running');
    $('#simImgContainer').attr('src', 'http://i493.photobucket.com/albums/rr292/Claudihexe/Animierte%20Gifs/Laundry.gif');
  } else {
  }

  socket.emit('finish', 'washer state changed');
});

var simulate1 = function() {
  var state1 = $('#hiddenState1').val();
  socket.emit('simulate', state1);
};

var simulate2 = function() {
  var state2 = $('#hiddenState2').val();
  socket.emit('simulate', state2);
};
