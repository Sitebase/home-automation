(function() {

	var socket = io.connect('http://192.168.0.142');
		  
	/**function trigger() {
	console.log('go do something');
	socket.emit('message', { my: 'data' });
	}*/

	$('[data-trigger]').on('dblclick', function(e) {
		var data = $(this).data();
		data.loation = 'mobile';
		data.type = 'dblclick';
		console.log('Button double click', data);
		socket.emit('message', data);
	});

	socket.on('data', function (data) {

		// Data must be of type sensor
		if( data.type !== 'sensor' ) 
			return;

		var id = data.id;

		if( $('#' + id).length > 0 ) { // Row item already exist, just update the values
			var $row = $('#' + id);
			$row.find('td:eq(2)').html( data.value );
		} else { // Row item does not yet exist
			var html = '<tr id="' + id +  '"><td>' + data.name + '</td><td>' + data.source + '</td><td>' + data.value + '</td></tr>';
			$('#sensors tbody').append(html);
		}

	});

})();