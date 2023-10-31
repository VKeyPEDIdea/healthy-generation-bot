const cities = require("./cities");
const keyboards = require("./keyboards");
const messages = require("./messages");

const handlers = {
	'/start': async (ctx) => {
		await ctx.reply(messages.city, keyboards.cities);
	},
};

for (const key in cities) {
	handlers[key] = async (ctx) => {
		await ctx.editMessageText(messages.lang, keyboards.lang);
	}	
}


module.exports = handlers;
