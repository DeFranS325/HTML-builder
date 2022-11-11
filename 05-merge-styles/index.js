const fs = require('fs');
const path = require('path');

const rootPath = __dirname;
const bundlePath = path.join(rootPath, 'project-dist');
const stylePath = path.join(rootPath, 'styles');
const bundle = path.join(bundlePath, 'bundle.css');

function addToFile(currFile) {
    fs.readFile(currFile, 'utf8', (errReadFile, data) => {
        if (errReadFile) throw errReadFile;

        fs.appendFile(bundle, `\n/* add from ${path.basename(currFile)} */\n${data}\n`, (errAddData) => {
            if (errAddData) throw errAddData;
        });
    });    
}

function readStyleFiles(dir) {
    fs.readdir(dir, { encoding: 'utf8', withFileTypes: true }, (errDir, files) => {
        if (errDir) throw errDir;

        for (let file of files) {
            if (path.extname(file.name) === '.css') {
                if (file.isDirectory()) {
                    let newPath = path.join(dir, file.name);
                    readStyleFiles(newPath);
                }
                else {
                    addToFile(path.join(dir, file.name));
                }
            }
        }
    });
}

function createBundle() {
    fs.unlink(bundle, () => {
        fs.rmdir(bundlePath, () => {
            fs.mkdir(bundlePath, () => { readStyleFiles(stylePath); });
        });        
    });    
}

createBundle();