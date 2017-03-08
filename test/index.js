'use strict';

require('chai').should();
const sinon = require('sinon');
const botControl = require('starbot-ktotam-bot');
const Adapter = require('..');
const axios = require('axios');
const querystring = require('querystring');

describe('Telegram Adapter', () => {
  let bot = botControl({
    message: 'Кто там?'
  });

  let telegram = Adapter({
    token: 'fakeToken'
  }, bot);

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
