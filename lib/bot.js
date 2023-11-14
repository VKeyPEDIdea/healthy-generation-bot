const { Telegraf } = require('telegraf');

const BOT_TOKEN = '6975645836:AAH7Ju0pi3jdDwDrtiMFtEyKNWEoZXBbTgE';
module.exports = new Telegraf(BOT_TOKEN, {
    launchOptions: {
        port: process.env.PORT || 3000,
    },
});
