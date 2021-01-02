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
    const chess = new Chess();
    play(player1, player2, chess);
}

/**
 * Main chess runtime
 * @param {GuildMember} player1 White player
 * @param {GuildMember} player2 Black player
 * @param {Chess} chess Game board
 */
function play(player1, player2, chess) {
    var interface = {
        title: '2 Player Chess Game',
        color: 0xF6D887,
        description: generateDescription(player1, player2, chess),
        footer: {
            text: `History: ${chess.pgn()}`
        }
    };
    while (!chess.game_over())
}

/**
 * Generates embed description for game state
 * @param {GuildMember} player1 White player
 * @param {GuildMember} player2 Black player
 * @param {Chess} chess Chess game
 * @param {Boolean} whiteToMove Is it white's turn to move
 * @returns {String} Description string for embed
 */
function generateDescription(player1, player2, chess, whiteToMove = true) {
    if (whiteToMove) {
        return `${player1}, it's white's turn to move.\n\n\`\`\`${chess.ascii()}\`\`\``;
    } else {
        return `${player2}, it's black's turn to move.\n\n\`\`\`${chess.ascii()}\`\`\``;
    }
}