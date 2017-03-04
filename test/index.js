'use strict';

require('chai').should();
const sinon = require('sinon');
const botControl = require('starbot-ktotam-bot');
const Adapter = require('..');
const axios = require('axios');

describe('Telegram Adapter', () => {
  let bot = botControl({
    message: 'Кто там?'
  });

  let telegram = Adapter({
    token: 'fakeToken'
  }, bot);

  it('message_new', async () => {
    let stub = sinon.stub(axios, 'get', function (url, params) {
      url.should.equal('https://api.telegram.org/botfakeToken/sendMessage');
      params.should.deep.equal({
        params: {
          chat_id: 'fakeUserId',
          text: 'Кто там?'
        }
      });
    });

    await telegram({body: {
      message: {
        text: 'Привет',
        from: {
          id: 'fakeUserId'
        }
      }
    }}, {
      send: () => {},
      end: () => {}
    });

    stub.restore();
  });
});
