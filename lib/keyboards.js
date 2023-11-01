const fsp = require('node:fs/promises');
const path = require('node:path');
const { Markup } = require('telegraf');

const contentPath = path.join(process.cwd(), './content');
const cities = require('./cities');
const lang = require('./languages');
const menu = require('./menu');

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

for (const lang in menu) {
	const langMenu = menu[lang];
	for (const key in langMenu) {
		const btnText = langMenu[key];
		(async () => {
			try {
				const list = await fsp.readdir(`${contentPath}/${lang}/${key}`, 'utf-8');
				if (list.length) {
					const isFiles = list[0].includes('.');
					const entityList = list.reduce((acc, name) => {
						acc[name] = name;
						return acc;
					}, {});
					createButtons({ [btnText]: entityList });
				}
			} catch (error) {
				// console.error(error);
			}
			createKeyboards();
		})();
	}
}

for (const entity of entityList) {
	createButtons(entity);
}

module.exports = keyboards;
