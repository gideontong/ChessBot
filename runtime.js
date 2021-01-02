const timeout = 3 * 60;

const { Chess } = require('chess.js');

/**
 * Chess runtime
 * @param {TextChannel} channel Channel of message
 * @param {Message} message Message emitted
 * @param {Array} args Arguments
 */
module.exports = async (channel, message, args) => {
    if (message.mentions.members.size == 0) {
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
    start(channel, player1, player2, chess);
}

/**
 * Start chess runtime
 * @param {GuildMember} player1 White player
 * @param {GuildMember} player2 Black player
 * @param {Chess} chess Game board
 */
function start(channel, player1, player2, chess) {
    var interface = {
        title: '2 Player Chess Game',
        color: 0xF6D887,
        description: '',
        footer: {
            text: 'Say a valid PGN move in chat in the next 3 minutes to use it.'
        }
    };
    if (!chess.game_over()) {
        startTurn(channel, player1, player2, chess, interface);
    }
}

function startTurn(channel, player1, player2, chess, interface, whiteToMove = true) {
    interface.description = generateDescription(player1, player2, chess, whiteToMove);
    channel.send({ embed: interface })
        .then(message => {
            const filter = message => {
                if (message.author.id == (whiteToMove ? player1.id : player2.id)) {
                    if (chess.moves().includes(message.content.toLowerCase())) {
                        return true;
                    } else {
                        channel.send('You have to provide a valid PGN move!');
                        return false;
                    }
                } else {
                    return false;
                }
            };
            channel.awaitMessages(filter, { max: 1, time: timeout * 1000, errors: ['time'] })
                .then(collected => {
                    const move = collected.first().content.toLowerCase();
                    chess.move(move);
                    endTurn(channel, player1, player2, chess, interface, whiteToMove);
                })
                .catch(err => {
                    channel.send('You ran out of time to make a move!');
                    if (err instanceof Map) {
                        console.warn('User ran out of time while running runtime.startTurn.awaitMessages');
                    } else {
                        console.err(`I may have gotten an error while running runtime.startTrun.awaitMessages: ${err}`);
                    }
                });
        })
        .catch(err => {
            console.error(`Got error with runtime.startTurn: ${err}`);
        });
}

function endTurn(channel, player1, player2, chess, interface, whiteToMove) {
    if (!chess.game_over()) {
        startTurn(channel, player1, player2, chess, interface, !whiteToMove);
    } else {
        channel.send('The game has ended.');
    }
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