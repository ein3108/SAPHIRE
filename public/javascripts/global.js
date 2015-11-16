var applianceData = [];

$(document).ready(function() {
  populateTable();
});

function populateTable() {
  var tableContent = '';
  $.getJSON('/simulators', function(data) {
    $.each(data, function() {
      tableContent += '<tr>';
      tableContent += '<td>' + this.appliancename + '</td>';
      tableContent += '<td><a href="#">simulate</a></td>';
      tableContent += '<td><a href="#">delete</a></td>';
      tableContent += '</tr>';
    });

    $('#simulatorList table tbody').html(tableContent);
  });
};
