const { Telegraf, Markup } = require('telegraf');
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);
const botName = 'Здоровое поколение';
const buttonNames = {
    ru: {
        info: '📘 Информация о ВИЧ',
        reminder: '🔔 Напомнить о приеме АРТ',
        pravo: '⚖️ Права пациента',
        contacts: '☎️ Обратная связь',
        tests: '🧪 Тесты на ВИЧ',
        consultant: '👨🏼‍💼 Связаться с консультантом',
        helpChat: '📥 Чат взаимопомощи',
        lang: '🔁 Сменить язык',
    },
    kz: {
        info: '📘 АИТВ туралы ақпарат',
        reminder: '🔔 АРТ қабылдау туралы еске салу',
        pravo: 'Науқастың құқықтары',
        contacts: '☎️ Кері байланыс',
        tests: '🧪 АИТВ-ға тесттер',
        consultant: '👨🏼‍💼 Кеңесшімен байланысу',
        helpChat: '📥 Өзара көмек көрсету чаты',
        lang: '🔁 Тілді ауыстыру',
    }
};

const langMsg = ` 
    Интерфейс тілін таңдаңыз. 
    ------------------------------- 
    Выберите язык интерфейса. 
`;
const startMsg = ` 
    Есіміңізді көрсетіңіз 
    ------------------------------- 
    Напишите, пожалуйста, своё имя ⬇️ 
`;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getCoinSide = () => getRandomInt(0, 1) === 0 ? 'Орёл' : 'Решка';
const coinInlineKeyboard = Markup.inlineKeyboard([
    Markup.button.callback('Подбросить ещё раз', 'flip_a_coin'),
]);

bot.hears('Подбросить монетку', ctx => ctx.reply(getCoinSide(), coinInlineKeyboard));
bot.action('flip_a_coin', async (ctx) => {
    await ctx.editMessageText(`${getCoinSide()}\nОтредактировано: ${new Date().toISOString()}`, coinInlineKeyboard);
});

const getRandomNumber = () => getRandomInt(0, 100);
const numberInlineKeyboard = Markup.inlineKeyboard([
    Markup.button.callback('Сгенерировать новое', 'random_number'),
]);

bot.hears('Случайное число', ctx => ctx.reply(getRandomNumber().toString(), numberInlineKeyboard));
bot.action('random_number', async (ctx) => {
    await ctx.editMessageText(`${getRandomNumber()}\nОтредактировано: ${new Date().toISOString()}`, numberInlineKeyboard);
});
bot.use(async (ctx) => {
    await ctx.reply('Что нужно сделать?', Markup
        .keyboard([
            ['Подбросить монетку', 'Случайное число'],
        ]).resize()
    )
});
bot.launch().then(() => console.log('Started'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));