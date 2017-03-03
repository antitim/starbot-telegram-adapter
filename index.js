'use strict';

const axios = require('axios');

module.exports = class TelegramAdapter {

  constructor (options, botControl) {
    let self = this;

    self.token = options.token;
    self.botControl = botControl;

    self.receiver = async function (req, res) {
      res.end();

      let body = req.body;

      if (body.message.text !== '/start') {
        let userId = 'telegram_' + body.message.from.id;
        let text = body.message.text;

        let answer = await self.botControl(userId, text);

        userId = answer.userId.split('telegram_')[1];
        text = answer.text;

        await axios.get('https://api.telegram.org/bot' + self.token + '/sendMessage', {
          params: {
            chat_id: userId,
            text: text
          }
        });
      }
    };
  }
};
