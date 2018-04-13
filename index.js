const axios = require('axios');
const querystring = require('querystring');

class Adapter {
  constructor (settings) {
    if (!settings.token) throw new Error('Not specified token in settings');

    this.token = settings.token;
  }

  set bot (bot) {
    this.message = bot.message.bind(bot);

    bot.on('message', (message) => {
      axios.request({
        url: 'https://api.telegram.org/bot' + this.token + '/sendMessage',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: querystring.stringify({
          chat_id: message.client.split('telegram-')[1],
          text: message.text
        })
      });
    });
  }

  async middleware (req, res, next) {
    try {
      const {
        body: {
          message
        }
      } = req;

      if (message.text !== '/start') {
        await this.message({
          client: `telegram-${message.from.id}`,
          text: message.text
        });
      }

      res.end();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Adapter;
