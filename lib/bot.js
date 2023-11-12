const { Telegraf } = require('telegraf');

const BOT_TOKEN = '6827702165:AAGJqFJEX9VHfeonwJS22kmziC51CRr7zlg';

let bot = null;

if (process.env.NODE_ENV === 'production') {
    bot = new Telegraf(BOT_TOKEN);
    bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
    bot = new Telegraf(BOT_TOKEN, { polling: true });
}

module.exports = bot;
