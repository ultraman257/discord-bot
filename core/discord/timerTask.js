const moment = require('moment');
const Discord = require("discord.js");

const client = require('./discord');

const loggerUtil = require('../utils/logger');
const log = loggerUtil.log;

function scheduledTask() {

    setInterval(function() {
        randomMessage();
    }, 500);
}

module.exports = scheduledTask;

function randomMessage() {

    try {
        const embed = new Discord.MessageEmbed()
            .setTitle('A Random Event!')
            .setColor('#ffd700')
            .setImage("https://matthewthaskins.com/img/matthew-home.png").setTimestamp();


        let guild = client.guilds.resolveID('405171650514911243');

        if (guild) {

            const chanel = client.channels.cache.get('405171650514911245');

            if (chanel) {

                log('debug', "I found it!");
                chanel.send(embed)
            }

        }
    } catch (e) {
        log('error', e);
    }




}