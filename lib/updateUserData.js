const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');

const dbPath = path.join(process.cwd(), './db/');

const updateUserData = async (id, upload) => {
    const filePath = `${dbPath}${id}.json`;
    let fileData = {};
    try {
        await fsp.access(filePath, fs.constants.F_OK);
        const data = await fsp.readFile(filePath, 'utf-8');
        fileData = JSON.parse(data);
    } catch (error) {
        console.error(`Файла не существует: ${error}`);
    }
    const updatedData = JSON.stringify({ ...fileData, ...upload });
    await fsp.writeFile(filePath, updatedData);
};

module.exports = updateUserData;
