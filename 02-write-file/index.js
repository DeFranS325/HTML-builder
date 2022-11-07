const fs = require('fs');
const path = require('path');
const dir = path.dirname(path.resolve('index.js')) + '/02-write-file/';
const fileName = 'text.txt';
const readline = require('readline');

const rw = fs.createWriteStream(`${dir} + ${fileName}`, 'utf-8');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function onExit() {
    console.log('Goodbye, dear friend!');
    rw.end('-============== End of file ==============-');
    rw.close();
    rl.close();
}

console.log('Please, input your think here: ');
rl.on('line', (answer) => {
    if (answer === 'exit') {
        onExit();
        return;
    }
    console.log('Please, input your think here: ');
    rw.write(`${answer}\n`);
});

rl.on('SIGINT', () => {
    onExit();
});