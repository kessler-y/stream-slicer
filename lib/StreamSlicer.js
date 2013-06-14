var Transform = require('stream').Transform;
var $u = require('util');

$u.inherits(StreamSlicer, Transform);
function StreamSlicer(options) {
	Transform.call(this, options);
	this._buffer = [];
	this._currentLength = 0;

	if (options && options.sliceBy)
		this._sliceBy = options.sliceBy;
	else
		this._sliceBy = '\n';

	if (options && options.newSlicer)
		this._newSlicer = new Buffer(options.newSlicer);
}

StreamSlicer.prototype._transform = function(chunk, encoding, callback) {

	if (Buffer.isBuffer(chunk)) {
		chunk = chunk.toString();
	}

	var start = 0;
	var index = -1;

	while( (index = chunk.indexOf(this._sliceBy, start)) > -1 ) {
		var miniChunk = chunk.substring(start, index);

		this._append( miniChunk );
		this._flush();

		start = index + 1;
	}

	var trailing = chunk.substring(start);
	
	if (trailing.length > 0)
		this._append( trailing );
};

StreamSlicer.prototype._append = function ( str ) {
	this._buffer.push(new Buffer(str));
	this._currentLength += str.length;
};

StreamSlicer.prototype._flush = function (callback) {
	if (this._newSlicer) {
		this._buffer.push(this._newSlicer);
		this._currentLength += this._newSlicer.length;
	}

	var data = Buffer.concat(this._buffer, this._currentLength);

	this._buffer = [];
	this._currentLength = 0;
	this.push(data);

//	console.log(callback);
};

module.exports = StreamSlicer;