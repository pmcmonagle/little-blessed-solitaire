'use strict';


/**
 * Represents a single card -- essentially an object with
 * a numerical value, textual representation and suit.
 */
function Card (value, suit) {
    this.value   = value;
    this.suit    = suit;
    this.flipped = false;
    this.string  = Card.STRINGS.hasOwnProperty(value)
        ? Card.STRINGS[value]
        : value.toString();
    this.string = this.suit.modifier + this.string + '\u001b[0m';
}

/**
 * Return the output string for this object.
 * @return {string}
 */
Card.prototype.render = function () {
    return this.flipped
        ? this.string
        : Card.BACK;
};

// Static

/**
 * Map numerical values to common strings,
 * eg. 1 -> A (ace)
 */
Card.STRINGS = {
    '1':  'A',
    '10': 'Ю',
    '11': 'J',
    '12': 'Q',
    '13': 'K'
};

Card.BACK = '\u001b[44m#\u001b[0m';

Card.SUITS = {
    SPADES:   { type: 'spades',   string: '♠', modifier: '\u001b[47;30m',  colour: 'black' },
    CLUBS:    { type: 'clubs',    string: '♣', modifier: '\u001b[107;90m', colour: 'black' },
    HEARTS:   { type: 'hearts',   string: '♥', modifier: '\u001b[41m',  colour: 'red' },
    DIAMONDS: { type: 'diamonds', string: '♦', modifier: '\u001b[101m', colour: 'red' }
};

/**
 * Return TRUE if 'b' immediately follows 'a'
 */
Card.isNextInSequence = function (a, b) {
    return b.value === a.value + 1;
};

/**
 * Return TRUE if 'b' immediately preceds 'a'
 */
Card.isPreviousInSequence = function (a, b) {
    return b.value === a.value - 1;
};

/**
 * Return TRUE if 'a' and 'b' have identical suits.
 */
Card.isMatchingSuit = function (a, b) {
    return a.suit === b.suit;
};

/**
 * Return TRUE if 'a' and 'b' are alternate colours.
 * ie. black and red
 */
Card.isAlternateColour = function (a, b) {
    return a.suit.colour !== b.suit.colour;
};

module.exports = Card;
