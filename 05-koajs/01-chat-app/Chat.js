const { EventEmitter } = require('events');

class Chat extends EventEmitter {
  publishMessage(msg) {
    this.emit('message', msg);
  }

  async getNextMessage() {
    return new Promise((resolve) => {
      this.once('message', resolve);
    });
  }
}

module.exports = Chat;
