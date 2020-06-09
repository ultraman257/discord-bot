const moment = require('moment');
const Discord = require("discord.js");

const client = require('./discord');

const loggerUtil = require('../utils/logger');
const log = loggerUtil.log;

let nextMessage = require('../randomDelay').nextMessage;

function scheduledTask() {

    setInterval(function() {
        randomMessage();
    }, 500);
}

module.exports = scheduledTask;

function randomMessage() {

    let guild = client.guilds.resolveID('405171650514911243');

    if (guild) {

        const chanel = client.channels.cache.get('405171650514911245');

        if (chanel) {

            if(moment().isAfter(nextMessage) || nextMessage == null) {
                log('debug', "Latifa!");

                let delay = Math.floor(Math.random() * 120) + 1;

                chanel.send("I am king latifa (" + delay  + ")");

                // Next random delay.
                nextMessage = moment().add(delay, "s");
            } else {
                log('debug', "Wait for it...");
            }




        }

    }


}