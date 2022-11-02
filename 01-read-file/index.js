const fs = require('fs');
let path = require('path');
let dir = `${path.dirname(path.resolve('index.js'))}/01-read-file`;
const rs = fs.createReadStream(dir + '/text.txt', 'utf-8');
rs.on('readable', function () {
    let data;
    while ((data = this.read()) != null) {
        console.log(data);
    }
});

rs.on('end', function () {
    this.close();
});