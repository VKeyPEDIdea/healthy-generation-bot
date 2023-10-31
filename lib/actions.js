const cities = require('./cities');
const actions = {};

for (const key in cities) {
	actions[key] = async (ctx) => {
		await ctx.editMessageText('Спасибо, вы указали город: ' + cities[key])
	};
}

module.exports = actions;
