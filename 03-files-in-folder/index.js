const fs = require('fs');
const path = require('path');
const secretFolder = path.dirname(path.resolve('./index.js')) + '\\03-files-in-folder\\secret-folder\\';

fs.readdir(secretFolder, { encoding: 'utf8', withFileTypes: true }, (err, files) => {
    if (err) throw err;
    for (let file of files) {
        if (!file.isDirectory()) {
            let fileExt = path.extname(file.name);
            let fileName = path.basename(file.name, fileExt);
            console.log(secretFolder + file.name);
            let fileSize = fs.stat(secretFolder + file.name, function (err, stats) {
                stats.size;
            });            
            console.log(`${fileName} - ${fileExt.replace('.','')} - ${fileSize}`);
        }
    }
});