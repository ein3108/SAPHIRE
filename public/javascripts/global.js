var applianceData = [];

$(documnet).ready(function() {
  populateTable();
});

function populateTable() {
  var tableContent = '';
  $.getJSON('/simulators', function(data) {
    $.each(data, function() {
      tableContent += '<tr>';
      //
      tableContent += '</tr>';
    });

    $('#simulatorList table tbody').html(tableContent);
  });
};
