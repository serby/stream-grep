var split = require('split')
  , EventListener = require('events').EventEmitter
  , ReadableStream = require('stream').Readable

function checkStream(stream) {
  if (!(stream instanceof ReadableStream)) {
    throw new Error('stream must be a readable stream')
  }
}

function find(stream, terms, matcher) {
  var lineCount = 0
    , found = 0
    , el = new EventListener()

  checkStream(stream)

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

  if (typeof matcher !== 'undefined') {
    if (typeof matcher !== 'function') {
      matcher = function () { return true }
    }
  }

  stream
  .pipe(split())
  .on('data', function (line) {
    lineCount += 1
    if (matcher) {
      terms.forEach(function (reg) {
        var foundItems = reg.exec(line)
        if (foundItems && foundItems.length > 0 && foundItems[0] !== '') {
          foundItems.forEach(function (item, i) {
            // Only show captured groups.
            if (i === 0) return
            if (matcher(item)) {
              el.emit('captured', item, lineCount)
              found += 1
            }
          })
        }
      })
      return
    }
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