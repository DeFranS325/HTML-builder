const fs = require('fs');
const path = require('path');
const secretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolder, { encoding: 'utf8', withFileTypes: true }, (err, files) => {
    if (err) throw err;

    for (let file of files) {
        if (!file.isDirectory()) {
            let fileExt = path.extname(file.name);
            let fileName = path.basename(file.name, fileExt);
            fs.stat(path.join(secretFolder, file.name), (err, stats) => {
                if (err) throw err;
                console.log(`${fileName} - ${fileExt.replace('.', '')} - ${stats.size / 1024}kb`);
            });
        }
    }
});