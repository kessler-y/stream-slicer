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

	it('will slice a stream by a separator and replace it with another', function (done) {
		
		var stream = new StreamSlicer({ sliceBy: '|', replaceWith: '-' });		
		var incoming = fs.createReadStream('./testdata');

		var slicerOutput = '';

		stream.on('end', function () {
			
			var expected = testdata.split('|').join('-');

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

	it('will emit an event for each slice it does', function (done) {
		
		var stream = new StreamSlicer({ sliceBy: '|' });		
		var incoming = fs.createReadStream('./testdata');

		var slicerOutput = [];

		stream.on('end', function () {
			
			var expected = testdata.split('|');

			assert.strictEqual(expected.length, slicerOutput.length);
			assert.deepEqual(expected, slicerOutput);
			done();
		});	

		stream.on('slice', function(data) {
			slicerOutput.push(data.toString());
		});

		incoming.pipe(stream).pipe(process.stdout);
	});

});
