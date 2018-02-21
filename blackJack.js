#!/usr/bin/env node
const readline = require('readline');

const { createLog,
        start,
        get2cards,
        exit, getIndex,
        score,
        validateScore,
        wonLose } = require('./systemFunctions/sys');
const { Player, Diller } = require('./systemFunctions/essentials');
const { colors, colorize, drawCards } = require('./style');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

const { FgBlack, FgRed, FgGreen, FgYellow, FgBlue, FgMagenta, FgCyan, FgWhite } = colors;

const diller = new Diller();
let dillerState = diller.state;
let { dillerCards, dillerScore } = dillerState;
const player = new Player();
let state = player.state;
let { deck, playerScore, playerCards, gotCards } = state;


const getCardsWrapper = () => {
    refreshValues();
    if (!gotCards) {
        playerCards.push(...get2cards(deck, player));
        dillerCards.push(...get2cards(deck, diller));
        player.state.gotCards = true;
        refreshValues()
        player.state.gotCards = true;
        playerScore = score(playerCards, playerScore);
        refreshValues();
        validateScore(playerScore, player, diller);
        return console.log('You have now:', drawCards(playerCards));
    } else {
        console.log(`You've already got cards, use 'more' to get one`);
    }
};

const moreCardsWrapper = (cards, scores) => {
    refreshValues();
    if (gotCards && scores < 22) {
        const ind = getIndex();
        cards.push(deck[ind])
        scores = score(cards, scores);
        return refreshValues();
    }
};

console.log(colorize(FgGreen, 'Welcome to the console implementation of the famous card\'s game Black JACK.'))
rl.question(colorize(FgYellow, 'Please, enter your name below: '), answer => {
    console.log(`${colorize(FgGreen, 'Hello, ')}${colorize(FgRed, answer)}`);
    console.log(colorize(FgWhite, 'Please, type \'start\' or \'0\' to start the game, or \'exit\' to leave the game.'));
})
rl.on('line', line => {
    switch(line) {
        case 'start':
        case '0':
            return start(player);
        case 'get cards':
        case '1':
            return getCardsWrapper();
        case 'more':
        case '2':
            if (score(dillerCards, dillerScore) > 21) {
                dillerCards.pop();
                refreshValues();
            } else {
                moreCardsWrapper(dillerCards, dillerScore);
            }
            moreCardsWrapper(playerCards, playerScore);
            const scores = score(playerCards, playerScore);
            if (!!player.state.playerCards.length) {
                console.log('Your cards:', drawCards(player.state.playerCards));
            }
            validateScore(scores, player, diller);
            if (!gotCards) console.log('You have to get cards first');
            return refreshValues();
        case 'score':
        case '3':
            console.log(`Your score is: ${score(playerCards, playerScore)}`);
            return refreshValues();
        case 'enough':
        case '4':
            dillerState.dillerScore = score(dillerCards, dillerScore);
            state.playerScore = score(playerCards, playerScore);
            while (dillerState.dillerScore <= 21) {
                moreCardsWrapper(dillerCards, dillerScore);
                dillerState.dillerScore = score(dillerCards, dillerScore);
            }
            if (dillerState.dillerScore > 21) {
                dillerState.dillerCards.pop();
                dillerState.dillerScore = score(dillerCards, dillerScore);
            }
            wonLose(player, diller);
            refreshValues();
            console.log(colorize(FgMagenta, `Wanna play more? Type \'start\' or \'0\'`));
            return refreshValues();
        case 'exit':
        case '5':
            return exit();
    }
})

function refreshValues() {
    dillerState = diller.state;
    dillerCards = dillerState.dillerCards;
    dillerScore = dillerState.dillerScore;
    state = player.state;
    playerScore = state.playerScore;
    playerCards = state.playerCards;
    gotCards = state.gotCards;
}
