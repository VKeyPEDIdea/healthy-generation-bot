const cities = require('./cities');
const handlers = require('./handlers');
const languages = require('./languages');
const actions = {};

for (const key in cities) {
	actions[key] = handlers[key];
}

for (const key in languages) {
	actions[key] = handlers[key];
}

module.exports = actions;
