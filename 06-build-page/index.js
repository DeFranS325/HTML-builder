const fs = require('fs');
const path = require('path');
const rootPath = __dirname;

const templateHTML = rootPath + '\\template.html';
const templateStylePath = rootPath + '\\styles\\';
const templateAssets = rootPath + '\\assets\\';
const headerHTML = rootPath + '\\components\\header.html';
const articlesHTML = rootPath + '\\components\\articles.html';
const footerHTML = rootPath + '\\components\\footer.html';

const projectPath = rootPath + '\\project-dist\\';
const projectAssets = projectPath + '\\assets\\';
const projectHTML = projectPath + 'index.html';
const projectCSS = projectPath + 'style.css';

//Clear project's folder, if she is exist
function clearFolder(dir) {
    fs.readdir(dir, { encoding: 'utf8', withFileTypes: true }, (err, files) => {
        if (err) throw err;

        for (let file of files) {
            if (file.isDirectory()) {
                let newDir = dir + '\\' + file.name;
                clearFolder(newDir);
            }
            else {
                fs.unlink(dir + file.name, () => { });
            }
        }
    });
}

//Create folder for project
function createFolder(dir) {
    fs.stat(dir, (e) => {
        if (!e) {
            clearFolder(dir);
        }
    });
    fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) throw err;

        createStyleFile();
        createHTMLFile();
        copyAssets(templateAssets, projectAssets);

        console.log('Create the project is complete!');
    });
}

//Append code in projectCSS file
function addToFile(currFile) {
    fs.readFile(currFile, 'utf8', (errReadFile, data) => {
        if (errReadFile) throw errReadFile;

        fs.appendFile(projectCSS, `\n/* add from ${path.basename(currFile)} */\n${data}\n`, (errAddData) => {
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
                    let newPath = dir + '\\' + file.name;
                    readStyleFiles(newPath);
                }
                else {
                    addToFile(dir + file.name);
                }
            }
        }
    });
}

function createStyleFile() {
    fs.unlink(projectCSS, () => { readStyleFiles(templateStylePath); });
}

//Append code in projectHTML file
function replaceInFile(source, result) {
    fs.readFile(source, 'utf-8', (errReadFile, data) => {
        if (errReadFile) throw errReadFile;

        fs.readFile(headerHTML, 'utf-8', (err, d) => {
            if (err) throw err;

            let htmlCode = data.replace('{{header}}', d);
            fs.writeFile(result, htmlCode, () => {

                fs.readFile(source, 'utf-8', (errReadFile, data) => {
                    if (errReadFile) throw errReadFile;

                    fs.readFile(articlesHTML, 'utf-8', (err, d) => {
                        if (err) throw err;

                        let htmlCode = data.replace('{{articles}}', d);
                        fs.writeFile(result, htmlCode, () => {

                            fs.readFile(source, 'utf-8', (errReadFile, data) => {
                                if (errReadFile) throw errReadFile;

                                fs.readFile(footerHTML, 'utf-8', (err, d) => {
                                    if (err) throw err;

                                    let htmlCode = data.replace('{{footer}}', d);
                                    fs.writeFile(result, htmlCode, () => { });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

function createHTMLFile() {
    fs.unlink(projectHTML, () => {
        fs.readFile(templateHTML, 'utf-8', (errReadFile, data) => {
            if (errReadFile) throw errReadFile;

            fs.writeFile(projectHTML, data, () => {
                replaceInFile(projectHTML, projectHTML);                
            });
        });
    });
}

//Copy assets folder
function delFilesInAssets(dir) {
    fs.readdir(dir, { encoding: 'utf8', withFileTypes: true }, (err, files) => {
        if (err) throw err;

        for (let file of files) {
            if (file.isDirectory()) {
                let newDir = dir + '\\' + file.name;
                delFilesInAssets(newDir);
            }
            else {
                fs.unlink(dir + file.name, () => {
                    fs.rmdir(dir, () => { });
                });
            }
        }
    });
}

function copyAssets(dir, newDir) {
    fs.stat(newDir, (e) => {
        if (!e) {
            delFilesInAssets(newDir);
        }
    });
    fs.mkdir(newDir, { recursive: true }, (err) => {
        if (err) throw err;

        fs.readdir(dir, { encoding: 'utf8', withFileTypes: true }, (err, files) => {
            if (err) throw err;

            for (let file of files) {
                if (file.isDirectory()) {
                    fs.mkdir(dir + file.name, { recursive: true }, (error) => {
                        if (error) throw error;

                        copyAssets(dir + file.name, newDir + file.name);
                    });
                }
                else {
                    fs.copyFile(dir + '\\' + file.name, newDir + '\\' + file.name, (errCopy) => {
                        if (errCopy) throw errCopy;
                    });
                }
            }
        });
    });
}

//Create project
function createProject(dir) {
    createFolder(dir);
}

createProject(projectPath);