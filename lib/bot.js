const { Telegraf } = require('telegraf');

const BOT_TOKEN = '6827702165:AAGJqFJEX9VHfeonwJS22kmziC51CRr7zlg';
module.exports = new Telegraf(BOT_TOKEN, {
    launchOptions: {
        port: process.env.PORT || 3000,
    },
});
