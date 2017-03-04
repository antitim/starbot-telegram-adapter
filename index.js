'use strict';

const axios = require('axios');

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

      await axios.get('https://api.telegram.org/bot' + token + '/sendMessage', {
        params: {
          chat_id: userId,
          text: text
        }
      });
    }
  };
};
