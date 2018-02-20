const colors = { 
    FgBlack: '\x1b[30m',
    FgRed: '\x1b[31m',
    FgGreen: '\x1b[32m',
    FgYellow: '\x1b[33m',
    FgBlue: '\x1b[34m',
    FgMagenta: '\x1b[35m',
    FgCyan: '\x1b[36m',
    FgWhite: '\x1b[37m',
    Reset: '\x1b[0m'
};

const typeStyle = (letter) => {
    switch(letter) {
        case 'D':
            return '♦';
        case 'H':
            return '♥';
        case 'S':
            return '♠';
        case 'C':
            return '♣';
    }
}

const colorize = (color, string, reset=colors.Reset) => {
    return color === colors.FgRed ? `${color}${string.toUpperCase()}${reset}` : `${color}${string}${reset}`;
}

const testObj = [ { suit: 'SPADES', value: 'JACK', code: 'JS' },
    { suit: 'CLUBS', value: '8', code: '8C' },
    { suit: 'DIAMONDS', value: '4', code: '4D' } ,
    { suit: 'DIAMONDS', value: '4', code: '10D' } 
]
function drawCards(cardsList) {
    let type, val, eSpace, typeColor, typeSlice, sketch;
    let firstLine = secondLine = thirdLine = fourthLine = '\n';
    cardsList.forEach((elem) => {
        const card = elem.code;
            typeSlice = card.slice(1);
            val = card.slice(0,1);
            type = typeStyle(typeSlice);
            eSpace = '';
            hyphen = '';
            if (card.length === 3) {
                typeSlice = card.slice(2);
                val = card.slice(0,2);
                type = typeStyle(typeSlice);
                eSpace = ' ';
                hyphen = '-';
            }
            typeSlice === 'H' || typeSlice === 'D' ? typeColor = colors.FgRed: typeColor = colors.FgBlack;

            const black = colors.FgBlack;
            firstLine += `${colorize(black, '------')}${colorize(black, hyphen)}  `;
            secondLine += `${colorize(black, '|')}${colorize(colors.FgBlue, val)}  ${colorize(typeColor, type)}${colorize(black, '|')}  `;
            thirdLine += `${colorize(black, '|')}    ${eSpace}${colorize(black, '|')}  `;
            fourthLine += `${colorize(black, '|')}${colorize(typeColor, type)}  ${colorize(colors.FgBlue, val)}${colorize(black, '|')}  `;
    });
    sketch = firstLine + secondLine + thirdLine + thirdLine + fourthLine + firstLine;
    return sketch;
}

exports.colors = colors;
exports.colorize = colorize;
exports.drawCards = drawCards;
