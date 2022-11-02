let fs = require('fs');
let path = require('path');
let dir = `${path.dirname(path.resolve('index.js'))}/01-read-file`;
fs.readFile(`${dir}/text.txt`, 'utf-8', function (error, fileContent) {
    if (error) throw error;
    console.log(fileContent);
});