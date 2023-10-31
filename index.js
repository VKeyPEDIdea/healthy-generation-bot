const fsp = require('node:fs/promises');
const path = require('node:path');

const { Telegraf } = require('telegraf');
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

const dbPath = path.join(process.cwd(), './db')

const writeUserNameToDB = async (userId, data) => {
    const filePath = `${dbPath}/users/${userId}.json`;
    return await fsp.writeFile(filePath, data);
};

const state = {
    lastMessageId: null,
};

const isMessageName = (ctx) => {
    return ctx.message.message_id - state.lastMessageId === 2;
}

const start = `
Есіміңізді көрсетіңіз
-------------------------------
Напишите, пожалуйста, своё имя ⬇️ 
`;

const lang = `
Интерфейс тілін таңдаңыз. 
------------------------------- 
Выберите язык интерфейса. 
`;

const messageList = {
    start,
    city: 'Выберите город',
    lang,
};

const handlers = {
    '/start': async (ctx) => {
        state.lastMessageId = ctx.message.message_id
        await ctx.reply(start);
    },
    name: async (ctx) => {
        const userId = ctx.message.from.id;
        const userData = JSON.stringify({ id: userId, name: ctx.message.text });
        writeUserNameToDB(userId, userData);
        await ctx.reply(`Спасибо, ${ctx.message.text}! Вы успешно прислали свое имя.`)
    },
};

bot.use(async (ctx) => {
    console.log(ctx.message);
    const userMessage = ctx.message.text;
    if (Object.hasOwn(handlers, userMessage)) {
        handlers[userMessage](ctx);
    } else if (isMessageName(ctx)) {
        handlers.name(ctx);
    }
});


bot.launch().then(() => console.log('Started'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));