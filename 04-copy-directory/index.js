const fs = require('fs');
const path = require('path');
const filesFolder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

function delFilesInDir(dir) {
    fs.readdir(dir, { encoding: 'utf8', withFileTypes: true }, (err, files) => {
        if (err) throw err;

        for (let file of files) {
            if (file.isDirectory()) {
                let newDir = path.join(dir, file.name);
                delFilesInDir(newDir);
            }
            else {
                fs.unlink(path.join(dir, file.name), () => { });
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
                    fs.mkdir(path.join(dir, file.name), { recursive: true }, (error) => { if (error) throw error; });
                    copyDir(path.join(dir, file.name), path.join(newDir, file.name));
                }
                else {
                    fs.copyFile(path.join(dir, file.name), path.join(newDir, file.name), (errCopy) => {
                        if (errCopy) throw errCopy;
                    });
                }
            }
        });
        console.log('Copy is complete!');
    });
}

copyDir(filesFolder, copyFolder);