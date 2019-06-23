# stream-grep

Streaming search for an array of regexs in a given stream, emits event when found.

[![build status](https://secure.travis-ci.org/serby/stream-grep.png)](http://travis-ci.org/serby/stream-grep) [![Greenkeeper badge](https://badges.greenkeeper.io/serby/stream-grep.svg)](https://greenkeeper.io/)

## Installation

      npm install stream-grep

## Usage

```js

var streamGrep = require('..')
  , fs = require('fs')

streamGrep(fs.createReadStream(__filename), [/create/])
  .on('found', function (term, line) {
    console.log('Found', term, 'line', line)
  })
  .on('end', function(found) {
    console.log('Terms found', found)
  })

```

## Credits
[Paul Serby](https://github.com/serby/) follow me on twitter [@serby](http://twitter.com/serby)

## Licence
Licensed under the [New BSD License](http://opensource.org/licenses/bsd-license.php)
