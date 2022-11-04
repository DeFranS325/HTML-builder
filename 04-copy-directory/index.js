const fs = require('fs');
const path = require('path');
const filesFolder = path.dirname(path.resolve('./index.js')) + '\\04-copy-directory\\files\\';
const copyFolder = path.dirname(path.resolve('./index.js')) + '\\04-copy-directory\\files-copy\\';

function delFilesInDir(dir) {
    fs.readdir(dir, { encoding: 'utf8', withFileTypes: true }, (err, files) => {
        if (err) throw err;

        for (let file of files) {
            if (file.isDirectory()) {
                let newDir = dir + '\\' + file.name;
                delFilesInDir(newDir);
            }
            else {
                fs.unlink(dir + file.name, () => { });
            }
        }
    });
}

function copyDir(dir, newDir) {
    fs.stat(newDir, (e) => {
        if (!e) {
            delFilesInDir(newDir);
        }
    });
    fs.mkdir(newDir, { recursive: true }, (err) => {
        if (err) throw err;

        fs.readdir(dir, { encoding: 'utf8', withFileTypes: true }, (err, files) => {
            if (err) throw err;

            for (let file of files) {
                if (file.isDirectory()) {
                    fs.mkdir(dir + file.name, { recursive: true }, (error) => { if (error) throw error; });
                    copyDir(dir + file.name, newDir + '\\' + file.name);
                }
                else {
                    fs.copyFile(dir + file.name, newDir + file.name, (errCopy) => {
                        if (errCopy) throw errCopy;
                    });
                }
            }
        });
        console.log('Copy is complete!');
    });
}

copyDir(filesFolder, copyFolder);