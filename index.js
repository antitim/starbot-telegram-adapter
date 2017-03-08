'use strict';

const axios = require('axios');
const querystring = require('querystring');

module.exports = function (settings, botControl) {
  let { token } = settings || {};

  return async (req, res) => {
    res.end();

    let body = req.body;

    if (body.message.text !== '/start') {
      let userId = 'telegram_' + body.message.from.id;
      let text = body.message.text;

      let answer = await botControl(userId, text);

      userId = answer.userId.split('telegram_')[1];
      text = answer.text;

      await axios.request({
        url: 'https://api.telegram.org/bot' + token + '/sendMessage',
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: querystring.stringify({
          chat_id: userId,
          text: text
        })
      });
    }
  };
};
