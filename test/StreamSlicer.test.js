var assert = require('assert');
var StreamSlicer = require('../lib/StreamSlicer');
var fs = require('fs');

var incoming = fs.createReadStream('./testdata');

//console.log(incoming.toString());

describe('StreamSlicer', function () {

	var stream = new StreamSlicer({ sliceBy: '|', newSlicer: '-' });

	it('will slice a stream by a separator', function () {
		
		var stream = new StreamSlicer({ sliceBy: '|', replaceWith: '-' });

		function readMore() {
			var result = stream.read();
			
			console.log(result);

			if (!result) {
				stream.once('readable', readMore);
			}
		}

		incoming.pipe(stream);

		readMore()
	});

});
