const { token } = require('./token.json');

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('Logged in!');
});

client.on('message', message => {
    const args = message.content.split(' ');
    if (args[0] == 'playchess') {
        try {
            require('./runtime.js')(message.channel, message, args);
        } catch (err) {
            console.error(`While trying to play chess I encountered an error: ${err}`);
        }
    }
});

client.login(token);