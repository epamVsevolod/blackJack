const fs = require('fs');

const { colors, colorize, drawCards } = require('../style');
const { FgBlack, FgRed, FgGreen, FgYellow, FgBlue, FgMagenta, FgCyan, FgWhite } = colors;

// Showing command variants
const createLog = (playerState, dillerState) => {
    const dataToSave = Object.assign({}, playerState, dillerState, { timeStop: new Date().toString() });
    delete dataToSave.gotCards;
    delete dataToSave.deck;
    delete dataToSave.dillerCards;
    delete dataToSave.playerCards;
    fs.appendFile('./data/game.log', JSON.stringify(dataToSave), err => {
        if (err) throw err;
        console.log(colorize(FgRed, 'System: Game log was update'));
    })
}

const cleanLog = () => {
    fs.writeFile('./data/game.log', '', err => {
        if (err) throw err;
        console.log(colorize(FgRed, 'System: Game log was update'));
    })
}

const start = (player) => {
    cleanLog();
    console.log(`${colorize(FgBlue, 'Command\'s list:')}
    ${colorize(FgYellow, `-type \'get cards\' or \'1\' to get cards
    -type \'more\' or \'2\' to get one more card
    -type \'score\' or \'3\' to get current score
    -type \'enough\' or \'4\' to compare scores
    -type \'exit\' or \'5\' to leave the game`)}`);
    return player.state = { ...player.state, timeStart: new Date().toString()}
};

const exit = () => {
    return process.exit();
}

const score = (state, currentScore) => {
    const value = state.map(el => {
        return ['JACK', 'QUEEN', 'KING'].includes(el.value) ?
        10 : (el.value === 'ACE' && currentScore < 11) ?
        11 : (el.value === 'ACE' && currentScore > 11) ?
        1  : +el.value;
    })
    return !(value.toString()) ? 0 : value.reduce((prev, curr) => prev + curr);
}

const cleanStatus = (player, diller) => {
    player.state = { ...player.state,
        timeStart: null,
        timeStop: null,
        gotCards: false,
        playerCards: [],
        dillerScore: 0,
        playerScore: 0,
    }
    diller.state = { 
        dillerScore: 0,
        dillerCards: []
    }
}

const validateScore = (score, player, diller) => {
    if (score > 21) {
        const playerState = player.state;
        const dillerState = player.state;
        console.log(`${colorize(FgRed, 'You\'re lose :\'(')}`);
        console.log(colorize(FgMagenta, `\nWanna play more? Type \'start\' or \'0\'`));
        player.state = { ...player.state,
            numberOfGames: player.state.numberOfGames +1,
            loseGames: player.state.loseGames +1,
        }
        createLog(player.state, diller.state);
        cleanStatus(player, diller);
    }
}

const get2cards = (deck, player) => {
    const userCards = [getIndex(), getIndex()]
    return [deck[userCards[0]], deck[userCards[1]]];
}

const wonLose = (player, diller) => {
    const playerState = player.state;
    const dillerState = diller.state;
    const playerScore = playerState.playerScore;
    const dillerScore = dillerState.dillerScore;
    if ((playerScore > dillerScore && playerScore < 22) ||
        (playerScore < dillerScore && dillerScore > 21)) {
        playerState.wonGames += 1;
        console.log(`${colorize(FgGreen, 'You won! :))) CONGRATS!')}
Your score is ${playerScore}, Diller's score is ${dillerScore}`);
    } else if (playerScore < dillerScore && playerScore < 22) {
        console.log(`${colorize(FgRed, 'You\'re lose :\'(')}
Your score is ${playerScore}, Diller's score is ${dillerScore}`);
        playerState.loseGames += 1;
    } else {
        console.log(`${colorize(FgWhite, 'Nobody won')}
Your score is ${playerScore}, Diller's score is ${dillerScore}, wanna play again? :)`);
        playerState.deadHeats += 1;
    }
    playerState.numberOfGames += 1;
    createLog(playerState, dillerState);
    console.log(`Your cards: ${drawCards(playerState.playerCards)}\nDiller's cards: ${drawCards(dillerState.dillerCards)}`)
    cleanStatus(player, diller);
}

const getIndex = () => {
    const value = Math.random() * 100;
    const index = value > 51 ? Math.round(value/2) : Math.round(value);
    return index;
};

exports.createLog = createLog;
exports.start = start;
exports.exit = exit;
exports.getIndex = getIndex;
exports.score = score;
exports.validateScore = validateScore;
exports.get2cards = get2cards;
exports.wonLose = wonLose;
