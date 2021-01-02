const { Chess } = require('chess.js');

/**
 * Chess runtime
 * @param {TextChannel} channel Channel of message
 * @param {Message} message Message emitted
 * @param {Array} args Arguments
 */
module.exports = async (channel, message, args) => {
    if (message.mentions.members.size == 1) {
        return channel.send('You have to tag someone in the server to play against them!');
    } else if (message.mentions.members.size > 1) {
        return channel.send('You can only tag one person to play against in 2-player chess!');
    }
    const player1 = message.member;
    const player2 = message.mentions.members.first();
    if (player2.user.bot) {
        return channel.send('Playing against a bot makes no sense... they don\'t have the ability to make moves.');
    }
    const game = new Chess();
    var interface = {
        title: '2 Player Chess Game',
        color: 0xF6D887,
        description: `${player1}, it's white's turn to move.\n\n\`\`\`${game.ascii()}\`\`\``,
        footer: {
            text: `History: ${game.pgn()}`
        }
    };
}