var simulatorData = [];

$(document).ready(function() {
  populateTable();
  $('#simulatorList table tbody').on('click', 'td a.linkshowinfo', showSimulatorInfo);
  $('#simulatorList table tbody').on('click', 'td a.simulate', simulate);
  $('#simulatorList table tbody').on('click', 'td a.linkdeletesimulator', deleteSimulator);
});

function populateTable() {
  $('#log').html('populateTable()');
  var tableContent = '';
  // jQuery Ajax from JSON
  $.getJSON('/simulators/simulatorlist', function(data) {
    /* 
     * sticking the entire result from the database
     * from its first access. This is NOT a good idea
     * for large-scale systems.
     */
    simulatorData = data;
    $.each(data, function() {
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowinfo" rel="' + this.simulatorname + '">' + this.simulatorname + '</a></td>';
      tableContent += '<td><a href="simulators/' + this.simulatorname + '" class="simulate">simulate</a></td>';
      tableContent += '<td><a href="#" class="linkdeletesimulator" rel="' + this._id + '">remove</a></td>';
      tableContent += '</tr>';
    });

    $('#simulatorList table tbody').html(tableContent);
  });
};

function showSimulatorInfo(event) {
  event.preventDefault();
  var thisSimName = $(this).attr('rel');
  /* We use the simulator's name as a key -- if there are duplicate names, modify this! */
  var arrayIdx = simulatorData.map(function(arrayItem) { return arrayItem.simulatorname; }).indexOf(thisSimName);
  var thisSimObj = simulatorData[arrayIdx];

  /* Retrieving info from the JSON object provided */
  document.getElementById('simName').innerHTML = thisSimObj.simulatorname;
  document.getElementById('simProp').innerHTML = thisSimObj.simulatorproperties;
  document.getElementById('simOp').innerHTML = thisSimObj.simulatoroperations;
  document.getElementById('simLoc').innerHTML = thisSimObj.simulatorlocation;
};

function addSimulator(event) {
  //event.preventDefault();
  var errorCount = 0;
  $('#addSimulator input').each(function(idx, val) {
    if($(this).val() === '') { errorCount++; }
  });

  if (errorCount === 0) {
    var newSim = {
      'simulatorname': $('#addSimulator fieldset input#inputSimulatorName').val(),
      'simulatorproperties': $('#addSimulator fieldset input#inputSimulatorProp').val(),
      'simulatoroperations': $('#addSimulator fieldset input#inputSimulatorOp').val(),
      'simulatorlocation': $('#addSimulator fieldset input#inputSimulatorLoc').val()
    };

    $.ajax({
      type:'POST',
      data:newSim,
      url:'simulators/addSimulator',
      dataType:'JSON',
    }).done(function(res) {
      if (res.msg === '') {
        // initialize with the field placeholders
        $('#addSimulator fieldset input.textfield').val('');
        populateTable();
      } else {
        alert('Error: ' + res.msg);
      }
    }).fail(function() {
      alert('Server Unavailable');
    });
  } else {
    alert('Please fill up all of the cells in the table');
  }
};

function deleteSimulator(event) {
  event.preventDefault();
  var confirmation = confirm('Are you sure you want to remove this simulator?');

  // user checks the message and confirms that it is the right simulator to be removed
  if (confirmation === true) {
    $.ajax({
      type:'DELETE',
      url:'simulators/deleteSimulator',
      data: {id: $(this).attr('rel')}
    }).done(function(res) {
      if (res.msg === '') {}
      else {
        alert('Error: ' + res.msg);
      }
      populateTable();
    }).fail(function() {
      alert('Server Unavailable');
    });
  } else {
    return false;
  }
};

function simulate(event) {
  //event.preventDefault();
  return true;
};
