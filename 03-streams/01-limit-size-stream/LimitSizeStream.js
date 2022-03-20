const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.bytesProcessed = 0;
  }

  _transform(chunk, _encoding, cb) {
    const bytesProcessed = chunk.length + this.bytesProcessed;

    if (bytesProcessed > this.limit) {
      cb(new LimitExceededError());
    } else {
      this.bytesProcessed = bytesProcessed;
      cb(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
