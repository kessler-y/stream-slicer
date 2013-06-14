var assert = require('assert');
var StreamSlicer = require('../lib/StreamSlicer');
var fs = require('fs');

var incoming = fs.createReadStream('./testdata');

describe('StreamSlicer', function () {

	it('will slice a stream by a separator and replace with a new one', function () {
		
		var stream = new StreamSlicer({ sliceBy: '|', replaceWith: '\n' });

		stream.on('end', function () {
			console.log('end')
		});	

		incoming.pipe(stream);

		incoming.on('end', function () {

			function readMore() {
				var result = stream.read();
				
				console.log(result)

				if (!result) {
					stream.on('readable', readMore)
				}
			}

			readMore();

		});
	});
});
