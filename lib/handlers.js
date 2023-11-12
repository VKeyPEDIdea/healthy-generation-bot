const fs = require('node:fs');
const cities = require("./cities");
const { generateKeyboards, buttonTitles } = require("./keyboards");
const languages = require("./languages");
const config = require("./config");
const menu = require('./menu');
const bot = require('./bot');

const handlers = {};
const store = {};

const isCorrectTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return (
    hours >= 0
    && hours < 24
    && minutes >= 0
    && minutes < 60
  );
};

const setReminder = (time, userId, ctx) => {
  const [hours, minutes] = time.split(':').map(Number);
  const currentTime = new Date();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentSeconds = currentTime.getSeconds();
  let delay = 0;

  if (currentHours < hours || (currentHours === hours && currentMinutes < minutes)) {
    delay = ((hours - currentHours) * 3600 + (minutes - currentMinutes) * 60 - currentSeconds) * 1000;
  } else {
    delay = ((hours + 24 - currentHours) * 3600 + (minutes - currentMinutes) * 60 - currentSeconds) * 1000;
  }

  store[userId].reminder = setTimeout(() => {
    ctx.reply(config.ru.reminder.notification.msg);
    setReminder(time, userId, ctx);
  }, delay);
};

const createHandlerReminder = (lang) => {
	handlers[lang + 'reminderWhatTime'] = async (ctx) => {
		await ctx.reply(config.ru.reminder.whatTime.msg);
	};
	handlers['oneTime'] = async (ctx) => {
		await ctx.reply(config.ru.reminder.whatTime.msg);
		store[ctx.update.callback_query.from.id] = { state: 'waiting_for_time', reminder: null };
	};
	handlers['delete'] = async (ctx) => {
    clearTimeout(store[ctx.update.callback_query.from.id].reminder);
		store[ctx.update.callback_query.from.id].reminder = null;
		await ctx.reply(config.ru.reminder.deletedSuccesfully.msg);
	};
	handlers['create'] = async (ctx) => {
    clearTimeout(store[ctx.update.callback_query.from.id].reminder);
		store[ctx.update.callback_query.from.id].reminder = null;
		await ctx.reply(config.ru.reminder.whatTime.msg);
		store[ctx.update.callback_query.from.id] = { state: 'waiting_for_time', reminder: null };
	};
};

bot.on('text', (ctx, next) => {
  const userId = ctx.message.from.id;
	if (store[userId] && store[userId].state === 'waiting_for_time'){
		const userInput = ctx.message.text;

		if (isCorrectTime(userInput)) {
			setReminder(userInput, userId + '', ctx);
			ctx.reply(`Принято, в ${ctx.message.text} вам придет напоминание о необходимости принять лекарства`);
			store[userId].state = null;
		} else {
			ctx.reply('Ошибка: некорректный формат даты. Пожалуйста, используйте формат, типа: 9:00');
		}
	}
	next();
});

generateKeyboards().then(keyboards => {
	handlers['/start'] = async (ctx) => {
		await ctx.reply(config.lang, keyboards.lang);
	};

	// Skip for now
	for (const city in cities) {
		handlers[city] = async (ctx) => {
			await ctx.editMessageText(config.lang, keyboards.lang);
		}	
	}
	
	for (const lang in languages) {
		handlers[lang] = async (ctx) => {
			await ctx.reply(config[lang].welcome, keyboards.menu[lang]);
		}
	}
	
	for (const lang in menu) {
		const langMenu = menu[lang];
		for (const key in langMenu) {
			const btnText = langMenu[key];
			handlers[btnText] = async (ctx) => {
				if (btnText === langMenu.language) {
					await ctx.reply(btnText, keyboards.lang);
				} else if (btnText === langMenu.reminder) {
          			if (store[ctx.message.from.id] && store[ctx.message.from.id].reminder) {
          	 			await ctx.reply(config.ru.reminder.delete.msg, keyboards[lang + 'reminderDelete']);
					} else {
						createHandlerReminder(lang);
						await ctx.reply(config[lang].reminder.initial.msg, keyboards[lang + 'reminderInit']);
					}
				} else if (btnText === langMenu.chat) {
          			await ctx.reply(config.helpChat);
       			} else if (btnText === langMenu.consultant) {
					await ctx.reply(config.consultantContact);
				} else {
					await ctx.reply(btnText, keyboards[btnText]);
				}
			}
		}
	}
	
	for (const { type, btnTitle, path } of buttonTitles) {
		if (type === 'file') {
			handlers[btnTitle] = (ctx) => {
				fs.readFile(path, 'utf8', async (err, fileContent) => {
					if (err) console.log(err);
					await ctx.editMessageText(fileContent);
				});
			}
		} else {
			handlers[btnTitle] = async (ctx) => {
				await ctx.editMessageText(btnTitle, keyboards[btnTitle]);			
			}
		}
	}
});

module.exports = handlers;
