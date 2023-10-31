const cities = require('./cities');
const handlers = require('./handlers');
const actions = {};

for (const key in cities) {
	actions[key] = handlers[key];
}

module.exports = actions;
