var socket = io.connect('http://ec2-52-25-254-206.us-west-2.compute.amazonaws.com:4200');
//var socket = io.connect('http://127.0.0.1:4200');

socket.on('connect', function(data) {
  socket.emit('join', 'refrigerator');
});

socket.on('broad', function(data) {
  //document.getElementById('state').innerHTML = data;
  
  if (data === 'refrigerator:closed_i') {
    $('#simImgContainer').prop('src', '/images/refrigeratorClosed_i.png');
    $('#simBtn1').prop('value', '');
    $('#simBtn2').prop('value', 'Open the door');
    $('#hiddenState1').prop('value', 'refrigerator:closed_i');
    $('#hiddenState2').prop('value', 'refrigerator:opened_i');
  } else if (data === 'refrigerator:opened_i') {
    $('#simImgContainer').prop('src', '/images/refrigeratorOpened_i.png');
    $('#simBtn1').prop('value', 'Close the door');
    $('#simBtn2').prop('value', 'Put an item in the refrigerator');
    $('#hiddenState1').prop('value', 'refrigerator:closed_i');
    $('#hiddenState2').prop('value', 'refrigerator:opened_i+1');
  } else if (data === 'refrigerator:opened_i+1') {
    $('#simImgContainer').prop('src', '/images/refrigeratorOpened_i+1.png');
    $('#simBtn1').prop('value', 'Take an item out of the refrigerator');
    $('#simBtn2').prop('value', 'Close the door');
    $('#hiddenState1').prop('value', 'refrigerator:opened_i');
    $('#hiddenState2').prop('value', 'refrigerator:closed_i+1');
  } else if (data === 'refrigerator:closed_i+1') { 
    $('#simImgContainer').prop('src', '/images/refrigeratorClosed_i+1.png');
    $('#simBtn1').prop('value', 'Open the door');
    $('#simBtn2').prop('value', '');
    $('#hiddenState1').prop('value', 'refrigerator:opened_i+1');
    $('#hiddenState2').prop('value', 'refrigerator:closed_i+1');
  } else {
  }

  socket.emit('finish', 'Refrigerator state changed');
});

var simulate1 = function() {
  var state = $('#hiddenState1').val();
  socket.emit('simulate', state);
};

var simulate2 = function() {
  var state = $('#hiddenState2').val();
  socket.emit('simulate', state);
};
