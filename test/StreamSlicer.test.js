var assert = require('assert');
var StreamSlicer = require('../lib/StreamSlicer');
var fs = require('fs');

var incoming = fs.createReadStream('./testdata');

//console.log(incoming.toString());

describe('StreamSlicer', function () {

	var stream = new StreamSlicer({ sliceBy: '|', newSlicer: '-' });

	it('will slice a stream by a separator', function () {
		
		var stream = new StreamSlicer({ sliceBy: '|', replaceWith: '-' });

		incoming.pipe(stream).pipe(process.stdout);

	});

});
