const { Telegraf } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;
module.exports = new Telegraf(BOT_TOKEN);
