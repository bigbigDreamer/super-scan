
const { fork } = require('child_process');

const worker = fork('./lib/index.js');

module.exports = worker;