const fs = require('fs');

function Player() {
    this.state = {
        timeStart: null,
        timeStop: null,
        gotCards: false,
        numberOfGames: 0,
        wonGames: 0,
        loseGames: 0,
        deadHeats: 0,
        deck: JSON.parse(fs.readFileSync('./data/cards.txt')),
        playerScore: 0,
        playerCards: []
    }
}

function Diller() {
    this.state = {
        dillerScore: 0,
        dillerCards: [],
        dillerEnough: false
    }
}

exports.Player = Player;
exports.Diller = Diller;