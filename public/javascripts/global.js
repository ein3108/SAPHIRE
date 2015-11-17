var applianceData = [];

$(document).ready(function() {
  populateTable();
});

function populateTable() {
  var tableContent = '';
  // jQuery Ajax from JSON
  $.getJSON('/simulators/simulatorlist', function(data) {
    $.each(data, function() {
      tableContent += '<tr>';
      tableContent += '<td>' + this.appliancename + '</td>';
      tableContent += '<td><a href="#">Information</a></td>';
      tableContent += '<td><a href="#simulators/' + this.appliancename + '">simulate</a></td>';
      tableContent += '<td><a href="#">remove</a></td>';
      tableContent += '</tr>';
    });

    $('#simulatorList table tbody').html(tableContent);
  });
};
