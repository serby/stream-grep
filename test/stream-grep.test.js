var fs = require('fs')
  , streamGrep =require('..')

function getStream() {
  return fs.createReadStream(__dirname + '/../stream-grep.js')
}

describe('stream-grep', function () {

  it('should throw error if no stream is passed', function () {
    (function() {
      streamGrep()
    }).should.throw('stream must be a readable stream')
  })

  it('should throw error if no stream is passed', function () {
    (function() {
      streamGrep(getStream())
    }).should.throw('\'terms\' must be not be empty')
  })

  it('should call done on a fixed length stream', function (done) {
    streamGrep(getStream(), /console\./)
    .on('end', function() {
      done()
    })
  })

  it('should return how many terms were found and be zero when none are found', function (done) {
    streamGrep(getStream(), /console\./)
    .on('end', function(found) {
      found.should.eql(0)
      done()
    })
  })

  it('should find instance of regexp and return line', function (done) {
    var found = []
    streamGrep(getStream(), /terms\.forEach/)
    .on('found', function(term, line) {
      found.push(line)
    })
    .on('end', function() {
      found.should.eql([41, 56])
      done()
    })
  })

  it('should find instance of regexp and return count on end event', function (done) {
    streamGrep(getStream(), /terms\.forEach/)
    .on('end', function(found) {
      found.should.eql(2)
      done()
    })
  })

  it('should find instance of many regexps ', function (done) {
    var found = []
    streamGrep(getStream(), [/terms/, /pipe/])
    .on('found', function(term, line) {
      found.push(line)
    })
    .on('end', function() {
      found.should.eql([11, 18, 19, 20, 22, 26, 27, 37, 41, 56])
      done()
    })
  })

  it('should find instance of many regexps using capture', function (done) {
    var found = []
    streamGrep(getStream(), /\'((?:\\.|[^\'\\])*)\'/, function () { return true })
    .on('captured', function(term, line) {
      found.push(line)
    })
    .on('end', function() {
      found.should.eql([1, 2, 3, 7, 27, 30, 31, 38, 43, 48, 58, 63, 64, 66, 67])
      done()
    })
  })

  it('should not find instance of many regexps using when matcher returns false ', function (done) {
    var found = []
    streamGrep(getStream(), /\'((?:\\.|[^\'\\])*)\'/, function () { return false })
    .on('captured', function(term, line) {
      found.push(line)
    })
    .on('end', function() {
      found.should.eql([])
      done()
    })
  })
})