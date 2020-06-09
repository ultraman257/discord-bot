const chalk = require('chalk');

const log = function(type, content) {
    let debug = ['debug', 'de'];
    let error = ['error', 'err', 'err'];
    let message = ['notice', 'msg'];

    if(debug.indexOf(type) > -1) {
        console.log(chalk`{yellowBright.bold [DEBUG]} ${content}`);
    } else if(error.indexOf(type)> -1) {
        console.log(chalk`{redBright.bold [DEBUG]} ${content}`);
    } else {
        console.log(chalk`{blueBright.bold [NOTICE]} ${content}`);
    }


};

module.exports = { log };