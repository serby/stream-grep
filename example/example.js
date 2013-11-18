var streamGrep = require('..')
  , fs = require('fs')

streamGrep(fs.createReadStream(__filename), [/create/])
  .on('found', function (term, line) {
    console.log('Found', term, 'line', line)
  })
  .on('end', function(found) {
    console.log('Terms found', found)
  })