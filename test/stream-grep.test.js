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
    streamGrep(getStream(), /terms\.forEach/)
    .on('found', function(term, line) {
      line.should.eql(30)
      done()
    })
  })

  it('should find instance of regexp and return count on end event', function (done) {
    streamGrep(getStream(), /terms\.forEach/)
    .on('end', function(found) {
      found.should.eql(1)
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
      found.should.eql([5, 14, 15, 16, 18, 22, 23, 27, 30])
      done()
    })
  })
})