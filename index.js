const http = require('http');
const bot = require('./lib/bot');
const handlers = require('./lib/handlers');

for (const trigger in handlers) {
	bot.action(trigger, handlers[trigger]);
}

bot.use(async (ctx) => {
	if (ctx.message) {
		console.log('message', ctx.message);
		const userMessage = ctx.message.text;
		if (Object.hasOwn(handlers, userMessage)) {
			handlers[userMessage](ctx);
		}
	} else if (ctx.update) {
		console.log('update', ctx.update);
		const userMessage = ctx.update.callback_query.data;
		if (Object.hasOwn(handlers, userMessage)) {
			handlers[userMessage](ctx);
		}
	}
});

bot.launch().then(() => console.log('Started'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


http.createServer((request, response) => {
	let body = [];
	request.on('error', err => {
		console.error(err);
	})
	.on('data', chunk => {
		body.push(chunk);
	})
	.on('end', () => {
		body = Buffer.concat(body).toString();
	});
}).listen(process.env.PORT);
 