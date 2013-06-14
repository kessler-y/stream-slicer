var assert = require('assert');
var StreamSlicer = require('../lib/StreamSlicer');
var fs = require('fs');

var incoming = fs.createReadStream('./testdata');

describe('StreamSlicer', function () {

	it('will slice a stream by a separator and replace with a new one', function () {
		
		var stream = new StreamSlicer({ sliceBy: '|', replaceWith: '\n' });

		incoming.pipe(stream).pipe(process.stdout);
	});

});
