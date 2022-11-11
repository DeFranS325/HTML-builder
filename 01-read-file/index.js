const fs = require('fs');
let path = require('path');
const rs = fs.createReadStream(path.join(__dirname, '/text.txt'), 'utf-8');
rs.on('readable', function () {
    let data;
    while ((data = this.read()) != null) {
        console.log(data);
    }
});

rs.on('end', function () {
    this.close();
});