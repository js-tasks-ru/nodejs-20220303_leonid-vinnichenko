const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.accum = [];
  }

  _transform(chunk, _encoding, cb) {
    const str = chunk.toString();

    for (let i = 0; i < str.length; i++) {
      const char = str.charAt(i);
      if (char !== os.EOL) {
        this.accum.push(char);
      } else {
        const line = this.accum.join('');
        this.accum = [];
        this.push(line);
      }
    }
    cb();
  }

  _flush(cb) {
    cb(null, this.accum.join(''));
    this.accum = null;
  }
}

module.exports = LineSplitStream;
