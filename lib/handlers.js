const fs = require('node:fs');
const cities = require("./cities");
const { generateKeyboards, buttonTitles } = require("./keyboards");
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
	
	for (const { type, btnTitle, path } of buttonTitles) {
		if (type === 'file') {
      console.log('button', type,  btnTitle);
			handlers[btnTitle] = (ctx) => {
				fs.readFile(path, 'utf8', async (err, fileContent) => {
					if (err) console.log(err);
					await ctx.editMessageText(fileContent);
				});
			}
		} else {
			handlers[btnTitle] = async (ctx) => {
        console.log('handler for', btnTitle);
        console.log('keybords for', btnTitle, keyboards[btnTitle].reply_markup.inline_keyboard);
				await ctx.editMessageText(btnTitle, keyboards[btnTitle]);			
			}
		}
	}
});

module.exports = handlers;
