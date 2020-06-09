module.exports = {
    name: 'ping',
    description: 'A test command',
    cooldown: 10,
    execute: function(msg, args) {
        msg.reply('pong!')
    }
}