const { Markup } = require('telegraf');
const cities = require('./cities');
const keyboards = {};
const buttons = {
	cities: [],
};

for (const key in cities) {
	buttons.cities.push(Markup.button.callback(cities[key], key));
}

for (const group in buttons) {
	keyboards[group] = Markup.inlineKeyboard(buttons[group]);
}

module.exports = keyboards;
