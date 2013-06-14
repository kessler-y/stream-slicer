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

	if (options && options.replaceWith)
		this.replaceWith = new Buffer(options.replaceWith);
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
	if (this.replaceWith) {
		this._buffer.push(this.replaceWith);
		this._currentLength += this.replaceWith.length;
	}

	var data = Buffer.concat(this._buffer, this._currentLength);

	this._buffer = [];
	this._currentLength = 0;

	this.push(data);

	if (callback)
		callback();
};

module.exports = StreamSlicer;