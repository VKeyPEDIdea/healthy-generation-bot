const bot = require('./bot');
const fsp = require('node:fs/promises');
const path = require('node:path');
const { Markup } = require('telegraf');

const contentPath = path.join(process.cwd(), './content');
const cities = require('./cities');
const lang = require('./languages');
const menu = require('./menu');
const handlers = require('./handlers');

const entityList = [
	{ cities },
	{ lang }
];

const keyboards = {
	menu: {
		ru: Markup.keyboard([
			['📘 Информация о ВИЧ', '🔔 Напомнить о приеме АРТ'],
			['⚖️ Права пациента', '☎️ Обратная связь'],
			['🧪 Тесты на ВИЧ', '👨🏼‍💼 Связаться с консультантом'],
			['📥 Чат взаимопомощи', '🔁 Сменить язык',],
		]).resize(),
		kz: Markup.keyboard([
			['📘 АИТВ туралы ақпарат', '🔔 АРТ қабылдау туралы еске салу'],
			['⚖️ Науқастың құқықтары', '☎️ Кері байланыс'],
			['🧪 АИТВ-ға тесттер', '👨🏼‍💼 Кеңесшімен байланысу'],
			['📥 Өзара көмек көрсету чаты', '🔁 Тілді ауыстыру',],
		]).resize(),
	}
};

const buttons = {};

const createButtons = entityObj => {
	const [ entries ] = Object.entries(entityObj);
	const [ name, entity ] = entries;
	buttons[name] = [];
	for (const key in entity) {
		buttons[name].push(Markup.button.callback(entity[key], key));
	}
};

const createKeyboards = () => {
	for (const group in buttons) {
		keyboards[group] = Markup.inlineKeyboard(buttons[group]);
	}
};

async function traverseDirectoryRecursive(directoryPath, btnText) {
	try {
		const items = await fsp.readdir(directoryPath, 'utf-8');
		
		for (const item of items) {
			const itemPath = path.join(directoryPath, item);
			const stat = await fsp.stat(itemPath);
	// 		const btnName = stats.isFile()
	// 			? path.basename(item, path.extname(item))
	// 			: item;
	// 		// console.log('item', item);
			
			if (stat.isDirectory()) {
				// console.log('Directory: ', item);
				const entityList = items.reduce((acc, name) => {
					const key = name.includes('.') ? name.split('.')[0] : name;
					acc[key] = key;
					// handlers[key] = async (ctx) => {
					// 	console.log(ctx.update);
					// 	await ctx.editMessageText(key, keyboards[key]);			
					// }		
					return acc;
				}, {});
				createButtons({ [btnText]: entityList });
				await traverseDirectoryRecursive(itemPath, item);
			} else {
				// console.log('File', item);
			}
		}
	} catch (error) {
	// 	// console.error(`Ошибка при обходе папки ${directoryPath}: ${error}`);
	}
}

(async () => {
	for (const lang in menu) {
		const langMenu = menu[lang];
		for (const key in langMenu) {
			const btnText = langMenu[key];
			await traverseDirectoryRecursive(`${contentPath}/${lang}/${key}`, btnText);
		}
	}
	createKeyboards();
	handlers['Лечение'] = async (ctx) => {
		console.log(ctx.update);
		await ctx.editMessageText('Лечение', keyboards['Лечение']);			
	};

	for (const trigger in handlers) {
		console.log('trigger', trigger);
		bot.action(trigger, handlers[trigger]);
	}

	console.log('actions', bot.);
	
	// console.log('buttons', buttons);
})();

for (const entity of entityList) createButtons(entity);

module.exports = keyboards;
