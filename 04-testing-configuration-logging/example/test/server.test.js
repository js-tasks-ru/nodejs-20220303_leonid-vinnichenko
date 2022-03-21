const got = require('got');
const assert = require('assert');
const server = require('../server');

describe('server test', () => {
  before((done) => {
    server.listen(3001, done);
  });

  it('get /', async () => {
    const { body } = await got('http://localhost:3001');

    assert.strictEqual(body, 'hello world');
  });

  after((done) => {
    server.close(done);
  });
});
