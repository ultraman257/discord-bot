const Discord = require('discord.js');
const fs = require('fs');
const moment = require('moment');

const log = require('../utils/logger').log;
const token = require('../config').token;

const client = new Discord.Client();
const cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();

// Get the contents of the commands folder
const commandFiles = fs.readdirSync('./core/discord/commands');

// Require all the commands and add to a collection
for (const file of commandFiles) {
    const command = require("./commands/" + file);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    log('msg', `I am ${client.user.tag}!`);
});

client.on("messageDelete", async (message) => {
    if (message.author.bot) return;

    message.guild.fetchAuditLogs({ action: "MESSAGE_DELETE", limit: 1 }).then(logs => logs.entries.first()).then((log) => {
        require('../utils/logger').log('WARN', "Message deleted");
        if(log === undefined) return;

        let user = log.executor;
        console.log(log);

        let embed = new Discord.RichEmbed()
            .setTitle(message.author.username + "#" + message.author.discriminator, true)
            .setThumbnail(user.avatarURL, true)
            .addField("Message deleted in #" + message.channel.name, `Deleted by: ${user.username}#${user.discriminator}`)
            .addField("Content", message.content)
            .setColor(0xC10029)
            .setFooter(`User ID: ${message.author.id} | ${moment().format('MMMM Do YYYY, h:mm:ss a')}`)
        const channel = message.guild.channels.find("name", "mod-logs");
        if (!channel) return;
        if (channel === message.channel) return;
        channel.send(embed);

    });

});

client.on('message', msg => {
    // Check if message doesn't start with command prefix, or if message is from bot.
    if (!msg.content.startsWith("!") || msg.author.bot) return;

    const args = msg.content.slice("!".length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if(!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (!timestamps.has(msg.author.id)) {
        timestamps.set(msg.author.id, now);
        setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
    }
    else {
        const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

        if (now < expirationTime && msg.author.id !== "401851336271855622") {
            const timeLeft = (expirationTime - now) / 1000;
            return msg.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }

        timestamps.set(msg.author.id, now);
        setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
    }

    // if(!command.guildOnly || command.guildOnly === undefined && msg.channel.type !== "text") return;

    if(command.args && !args.length) {
        if(command.noArgs) {
            return msg.channel.send(command.noArgs)
        } else {
            return msg.channel.send(`You didn't provide any arguments, ${msg.author}`)
        }
    }


    try {
        command.execute(msg, args, client);
    } catch(error) {
        console.log(error);
        msg.reply("there was an error trying to run that command. Sorry.")
    }

    if (command === 'args-info') {
        if (!args.length) {
            return msg.channel.send(`You didn't provide any arguments, ${msg.author}!`);
        } else if (args[0] === 'foo') {
            return msg.channel.send('bar')
        }

        msg.channel.send(`Command name: ${command}\nArguments: ${args}`);
    }
});


function print(args) {
    console.log(args);
}


module.exports = client;

client.login(token);