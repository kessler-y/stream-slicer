Stream slicer
=============

```
var StreamSlicer = require('stream-slicer');
var fs = require('fs');

var read = fs.createReadStream('data');  // data === '1|2|3|4|5|6';
var write = fs.createWriteStream('data1');

var slicer = new StreamSlicer({ sliceBy: '|', replaceWith: '\n'});

read.pipe(slicer).pipe(write); 

/*
	data1 ===

	1
	2
	3
	4
	5
	6

*/

```