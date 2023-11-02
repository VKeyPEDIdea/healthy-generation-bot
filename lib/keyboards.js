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
const buttonTitles = new Set();

function truncateCallbackData(text) {
  const utf8Length = (str) => Buffer.from(str, 'utf8').length;
  const maxLengthInBytes = 32;
  return (utf8Length(text) > maxLengthInBytes)
  ? text.slice(0, maxLengthInBytes)
  : text;  
} 

const createButtons = entityObj => {
  const [ entries ] = Object.entries(entityObj);
  const [ name, entity ] = entries;
  buttons[name] = [];
  for (const key in entity) {
    buttons[name].push([Markup.button.callback(entity[key], key)]);
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
    const entityList = {};
    for (const item of items) {
      const itemPath = path.join(directoryPath, item);
      const stat = await fsp.stat(itemPath);
      const btnTitle = stat.isFile()
        ? path.basename(item, path.extname(item))
        : item;
      const truncated = truncateCallbackData(btnTitle);
      entityList[truncated] = btnTitle;
      buttonTitles.add({
        type: stat.isFile() ? 'file' : 'dir',
        btnTitle: truncated,
        path: itemPath,
      });
      
      if (stat.isDirectory()) {
        await traverseDirectoryRecursive(itemPath, item);
      }
    }
    createButtons({ [btnText]: entityList });
  } catch (error) {
    // 	// console.error(`Ошибка при обходе папки ${directoryPath}: ${error}`);
  }
}

const generateKeyboards = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      for (const lang in menu) {
        const langMenu = menu[lang];
        for (const key in langMenu) {
          const btnText = langMenu[key];
          await traverseDirectoryRecursive(`${contentPath}/${lang}/${key}`, btnText);
        }
      }
      createKeyboards();
      resolve(keyboards);			
    } catch (error) {
      reject(error);
    }
  });
};

for (const entity of entityList) createButtons(entity);

module.exports = { generateKeyboards, buttonTitles };
