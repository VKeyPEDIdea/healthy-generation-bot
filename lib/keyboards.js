const { Markup } = require('telegraf');
const cities = require('./cities');
const languages = require('./languages');
const keyboards = {
	menu: Markup.keyboard([
		['📘 Информация о ВИЧ', '🔔 Напомнить о приеме АРТ'],
		['⚖️ Права пациента', '☎️ Обратная связь'],
		['🧪 Тесты на ВИЧ', '👨🏼‍💼 Связаться с консультантом'],
		['📥 Чат взаимопомощи', '🔁 Сменить язык',],
	]).resize(),
};
const buttons = {
	cities: [],
	lang: [],
};

for (const key in cities) {
	buttons.cities.push(Markup.button.callback(cities[key], key));
}

for (const key in languages) {
	buttons.lang.push(Markup.button.callback(languages[key], key));
}

for (const group in buttons) {
	keyboards[group] = Markup.inlineKeyboard(buttons[group]);
}

module.exports = keyboards;
