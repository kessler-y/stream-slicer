var assert = require('assert');
var StreamSlicer = require('../index');
var fs = require('fs');

var testdata = fs.readFileSync('./testdata', 'utf8');

describe('StreamSlicer', function () {

	it('will slice a stream by a separator', function (done) {
		
		var stream = new StreamSlicer({ sliceBy: '|' });		
		var incoming = fs.createReadStream('./testdata');

		var slicerOutput = '';

		stream.on('end', function () {
			
			var expected = testdata.split('|').join('');

			assert.strictEqual(expected, slicerOutput);
			done();
		});	

		incoming.pipe(stream);

		incoming.on('end', function () {

			function readMore() {
				var result = stream.read();

				if (result === false) {
					stream.on('readable', readMore)
				} else {
					slicerOutput += result;
				}
			}

			readMore();

		});
	});

});
