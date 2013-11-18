var split = require('split')
  , EventListener = require('events').EventEmitter
  , ReadableStream = require('stream').Readable

function find(stream, terms) {
  var lineCount = 0
    , found = 0
    , el = new EventListener()

  if (!(stream instanceof ReadableStream)) {
    throw new Error('stream must be a readable stream')
  }

  if (!Array.isArray(terms)) {
    if (terms) {
      terms = [terms]
    } else {
      terms = []
    }
  }

  if (terms.length === 0) {
    throw new Error('\'terms\' must be not be empty')
  }

  stream
  .pipe(split())
  .on('data', function (line) {
    lineCount += 1
    terms.forEach(function (reg) {
      if (line.match(reg)) {
        el.emit('found', reg, lineCount)
        found += 1
      }
    })
  })
  .on('end', function () {
    el.emit('end', found)
  })
  .on('error', function (error) {
    el.emit('error', error)
  })

  return el
}

module.exports = find