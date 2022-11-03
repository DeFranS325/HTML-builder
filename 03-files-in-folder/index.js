const fs = require('fs');
const { stat } = require('fs/promises');
const path = require('path');
const secretFolder = path.dirname(path.resolve('./index.js')) + '\\03-files-in-folder\\secret-folder\\';

fs.readdir(secretFolder, { encoding: 'utf8', withFileTypes: true }, (err, files) => {
    if (err) throw err;

    for (let file of files) {
        if (!file.isDirectory()) {
            let fileExt = path.extname(file.name);
            let fileName = path.basename(file.name, fileExt);
            fs.stat(secretFolder + file.name, (err, stats) => {
                if (err) throw err;
                console.log(`${fileName} - ${fileExt.replace('.', '')} - ${stats.size/1000}kb`);
            });
        }
    }
});