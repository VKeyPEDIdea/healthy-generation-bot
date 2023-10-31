const { Telegraf, Markup } = require('telegraf');
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

const langMsg = `
Интерфейс тілін таңдаңыз. 
------------------------------- 
Выберите язык интерфейса. 
`;

const messages = {
	city: 'Выберите город',
	lang: langMsg,
};

const cities = {
	'Almaty': 'Алматы',
	'Ust-Kamenogorsk': 'Усть-Каменогорск',
};

const actions = {};
for (const key in cities) {
	actions[key] = async (ctx) => {
		await ctx.editMessageText('Спасибо, вы указали город: ' + cities[key])
	};
}

for (const trigger in actions) {
	bot.action(trigger, actions[trigger]);
}

const cityInlineKeyboard = Markup.inlineKeyboard([
    Markup.button.callback('Алматы', 'Almaty'),
    Markup.button.callback('Усть-Каменогорск', 'Ust-Kamenogorsk'),
]);

const handlers = {
	'/start': async (ctx) => {
		await ctx.reply(messages.city, cityInlineKeyboard);
	},
};

bot.use(async (ctx) => {
	if (ctx.message) {
		console.log(ctx.message);
		const userMessage = ctx.message.text;
		if (Object.hasOwn(handlers, userMessage)) {
			handlers[userMessage](ctx);
		}
	}
});

bot.launch().then(() => console.log('Started'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));