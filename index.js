const bot = require('./lib/bot');
const actions = require('./lib/actions');

for (const trigger in actions) {
	bot.action(trigger, actions[trigger]);
}

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