const cities = require("./cities");
const { generateKeyboards, buttonNames } = require("./keyboards");
const languages = require("./languages");
const messages = require("./messages");
const menu = require('./menu');
const updateUserData = require("./updateUserData");

const handlers = {};

generateKeyboards().then(keyboards => {
	handlers['/start'] = async (ctx) => {
		await ctx.reply(messages.city, keyboards.cities);
	};

	for (const city in cities) {
		handlers[city] = async (ctx) => {
			const id = ctx.update.callback_query.from.id;
			updateUserData(id, { city });
			await ctx.editMessageText(messages.lang, keyboards.lang);
		}	
	}
	
	for (const lang in languages) {
		handlers[lang] = async (ctx) => {
			const id = ctx.update.callback_query.from.id;
			updateUserData(id, { lang });
			await ctx.reply(messages[lang].welcome, keyboards.menu[lang]);
		}
	}
	
	for (const lang in menu) {
		const langMenu = menu[lang];
		for (const key in langMenu) {
			const btnText = langMenu[key];
			handlers[btnText] = async (ctx) => {
				await ctx.reply(btnText, keyboards[btnText]);			
			}
		}
	}
	
	for (const name of buttonNames) {
		handlers[name] = async (ctx) => {
			await ctx.editMessageText(name, keyboards[name]);			
		}
	}
});

module.exports = handlers;
