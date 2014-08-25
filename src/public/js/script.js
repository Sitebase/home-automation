(function() {
	var server = "http://" + document.location.hostname;
	var socket = io.connect( server );

	$('[data-trigger]').on('click', function(e) {
		console.log('Clicked');
		var data = $(this).data();
		data.loation = 'mobile';
		data.type = 'click';
		socket.emit('message', data);
	});

	$('[data-triggerer]').on('click', function(e) {
		console.log('Clicked');
		$.get(server + ':3000/api?type=click&trigger=button1');
	});

	socket.on('data', function (data) {

		// Data must be of type sensor
		if( data.type !== 'sensor' ) 
			return;

		var id = data.location;

		if( $('#' + id).length > 0 ) { // Row item already exist, just update the values
			var $row = $('#' + id);
			$row.find('td:eq(2)').html( data.value[0] );
		} else { // Row item does not yet exist
			var html = '<tr id="' + id +  '"><td>' + data.label + '</td><td>' + data.location + '</td><td>' + data.value[0] + '</td></tr>';
			$('#sensors tbody').append(html);
		}

	});

})();