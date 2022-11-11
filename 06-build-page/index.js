const fs = require('fs');
const path = require('path');
const rootPath = __dirname;

const templateHTML = path.join(rootPath, 'template.html');
const templateStylePath = path.join(rootPath, 'styles');
const templateAssets = path.join(rootPath, 'assets');

const projectPath = path.join(rootPath, 'project-dist');
const projectAssets = path.join(projectPath, 'assets');
const projectHTML = path.join(projectPath, 'index.html');
const projectCSS = path.join(projectPath, 'style.css');

//Clear project's folder, if she is exist
function clearFolder(dir) {
    fs.readdir(dir, { encoding: 'utf8', withFileTypes: true }, (err, files) => {
        if (err) throw err;

        for (let file of files) {
            if (file.isDirectory()) {
                let newDir = path.join(dir, file.name);
                clearFolder(newDir);
            }
            else {
                fs.unlink(path.join(dir, file.name), () => { });
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

function createStyleFile() {
    fs.unlink(projectCSS, () => { readStyleFiles(templateStylePath); });
}

async function createHTMLFile() {
    let innHTML = await fs.promises.readFile(templateHTML, 'utf-8');

    let sections = await fs.promises.readdir(path.join(rootPath,'components'), { withFileTypes: true });
    let sectionHTML = '';
    for (let i = 0; i < sections.length; i++) {
        if (sections[i].isFile() && path.extname(sections[i].name) === '.html') {
            sectionHTML = await fs.promises.readFile(path.join(rootPath, 'components', sections[i].name));
            innHTML = innHTML.replace(`{{${sections[i].name.slice(0, -5)}}}`, sectionHTML.toString());
        };
    };
    fs.writeFile(projectHTML, innHTML, () => { });

}

//Copy assets folder
function delFilesInAssets(dir) {
    fs.readdir(dir, { encoding: 'utf8', withFileTypes: true }, (err, files) => {
        if (err) throw err;

        for (let file of files) {
            if (file.isDirectory()) {
                let newDir = path.join(dir, file.name);
                delFilesInAssets(newDir);
            }
            else {
                fs.unlink(path.join(dir, file.name), () => {
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
                    fs.mkdir(path.join(dir,file.name), { recursive: true }, (error) => {
                        if (error) throw error;

                        copyAssets(path.join(dir, file.name), path.join(newDir, file.name));
                    });
                }
                else {
                    fs.copyFile(path.join(dir, file.name), path.join(newDir, file.name), (errCopy) => {
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