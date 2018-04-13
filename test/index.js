require('chai').should();
const sinon = require('sinon');
const Bot = require('starbot-ktotam-bot');
const Adapter = require('..');
const axios = require('axios');
const querystring = require('querystring');

describe('Telegram Adapter', () => {
  let bot = new Bot({
    message: 'Кто там?'
  });

  let adapter = new Adapter({
    token: 'fakeToken'
  });

  adapter.bot = bot;

  it('message_new', async () => {
    let stub = sinon.stub(axios, 'request', function (params) {
      params.should.deep.equal({
        url: 'https://api.telegram.org/botfakeToken/sendMessage',
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: querystring.stringify({
          chat_id: 'fakeUserId',
          text: 'Кто там?'
        })
      });
    });

    await adapter.middleware({ body: {
      message: {
        text: 'Привет',
        from: {
          id: 'fakeUserId'
        }
      }
    }}, {
      send: function () {},
      end: function () {}
    }, (err) => {
      err.should.be.null();
    });

    stub.restore();
  });
});
