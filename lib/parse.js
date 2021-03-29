const fs = require('fs');
const lessVarParse = require('less-var-parse');
const { resolve } = require('./utils');

const parseLessVariable = file => {
    file = resolve(file);

    return lessVarParse(fs.readFileSync(file).toString(), 'utf8');
}

module.exports = {
    parseLessVariable
};