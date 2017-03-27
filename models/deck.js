'use strict';

const Card = require('./card');

/**
 * Deck is a collection of 52 (4 * 13) cards.
 * It includes convenience methods for shuffling
 * and pulling cards. Pulling a card will return
 * it, an add it to a second hidden 'spent' stack.
 */
function Deck () {
    const suits        = Object.keys(Card.SUITS),
          cardsPerSuit = 13;

    this.cards   = [];
    this.removed = [];

    for (let i = 0; i < suits.length; i++) {
        // The cards are 1-Based since we start at Ace.
        // Just be careful not to run into off-by-ones.
        for (let j = 1; j <= cardsPerSuit; j++) {
            this.cards.push(new Card(j, Card.SUITS[suits[i]]));
        }
    }
}

/**
 * Shuffle an array in-place using the Durstenfeld
 * algorithm as borrowed from Stack Overflow.
 */
Deck.shuffle = function (array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
};

/**
 * Shuffle the deck of cards in place.
 */
Deck.prototype.shuffle = function () {
    Deck.shuffle(this.cards);
};

/**
 * Shuffle the removed cards in place.
 * Not sure of a use-case yet, but why not?
 */
Deck.prototype.shuffleRemoved = function () {
    Deck.shuffle(this.removed);
};

/**
 * Draw a card at index 'n', or off the top
 * of the deck if no index is supplied.
 *
 * TODO Safety against edge cases?
 */
Deck.prototype.draw = function (n) {
    let index = n ? n : 0,
        card  = this.cards.splice(index, 1)[0];
    this.removed.push(card);

    return card;
};

/**
 * Draw a random card from the deck.
 */
Deck.prototype.drawRandom = function () {
    return this.draw(Math.floor(Math.random() * this.cards.length));
};

module.exports = Deck;
