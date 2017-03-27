'use strict';

const Card = require('./card');

/**
 * A simple game of solitaire!
 */
function Solitaire () {
    this.remainder = [[], []];
    this.goals     = [[], [], [], []];
    this.lanes     = [[], [], [], [], [], [], []];
    this.grabbed   = [];

    this.grabbedFrom = null;
}

/**
 * Deal cards into the seven lanes, and throw the rest
 * into the remainder stack.
 */
Solitaire.prototype.deal = function (deck) {
    // Deal cards into 7 lanes
    for (let i = 0; i < this.lanes.length; i++) {
        for (let j = 0; j <= i; j++) {
            this.lanes[i].push(deck.drawRandom());
        }
        this.lanes[i][this.lanes[i].length - 1].flipped = true;
    }

    // Shove the rest into remainder
    while (deck.cards.length > 0) {
        this.remainder[0].push(deck.draw());
    };
};

/**
 * Show the next item in the remainder stack, or flip
 * the whole stack back over if there are no cards left.
 */
Solitaire.prototype.showNextRemainder = function () {
    if (this.remainder[0].length < 1 && this.remainder[1].length < 1)
        return;
    if (this.grabbed.length > 0 && this.grabbedFrom === this.remainder[1])
        return this.returnCard();

    if (this.remainder[0].length < 1) {
        while(this.remainder[1].length > 0) {
            this.remainder[0].push(this.remainder[1].pop());
        }
        this.remainder[0].forEach(card => card.flipped = false);
    } else {
        this.remainder[1].push(this.remainder[0].pop());
        this.remainder[1][this.remainder[1].length - 1].flipped = true;
    }
};

/**
 * Try to grab a remainder card. This is only possible
 * if we haven't already grabbed something, and a remainder
 * card is present.
 */
Solitaire.prototype.grabFromRemainder = function () {
    if (this.grabbed.length === 0 && this.remainder[1].length > 0) {
        this.grabCard(this.remainder[1]);
    } else if (this.grabbedFrom === this.remainder[1]) {
        this.returnCard();
    }
};

/**
 * Will either grab from goal, place on goal, or
 * do nothing depending on what we have grabbed
 * and whether or not it can placed on this goal.
 */
Solitaire.prototype.useGoal = function (goal) {
    if (this.grabbed.length < 1) {
        this.grabCard(goal);
    } else {
        if (this.grabbed.length === 1 && this.canBePlacedOnGoal(this.grabbed[0], goal))
            this.placeAll(goal);
        // else do nothing
    }
};

/**
 * Will either grab from lane, place on lane, or
 * do nothing depending on what we have grabbed
 * and whether or not it can be placed on this lane.
 */
Solitaire.prototype.useLane = function (lane) {
    if (this.grabbed.length < 1) {
        if (lane.length < 1)
            return;

        if (!lane[lane.length - 1].flipped) {
            lane[lane.length -1].flipped = true;
        } else {
            this.grabCard(lane);
        }
    } else {
        if (this.grabbedFrom === lane) {
            if (lane.length < 1 || !lane[lane.length - 1].flipped) {
                this.returnAll();
            } else {
                this.grabCard(lane);
            }
        } else if (this.canBePlacedOnLane(this.grabbed[this.grabbed.length - 1], lane)) {
            this.placeAll(lane);
        }
        // else do nothing
    }
};

/**
 * Return TRUE if card can be safely placed on goal.
 */
Solitaire.prototype.canBePlacedOnGoal = function (card, goal) {
    if (goal.length < 1)
        return card.value === 1;

    let topCard = goal[goal.length - 1];
    return Card.isMatchingSuit(topCard, card) && Card.isNextInSequence(topCard, card);
};

/**
 * Return TRUE if card can be safely placed on lane.
 */
Solitaire.prototype.canBePlacedOnLane = function (card, lane) {
    if (lane.length < 1)
        return card.value === 13;

    let topCard = lane[lane.length - 1];
    return Card.isAlternateColour(topCard, card) && Card.isPreviousInSequence(topCard, card);
};

/**
 * Pop a card off a stack and store it in the grab lane.
 * Keep a reference to the original stack so that we can return it
 * if we need to.
 */
Solitaire.prototype.grabCard = function (stack) {
    if (stack.length < 1)
        return;
    if (!stack[stack.length - 1].flipped)
        return;
    this.grabbed.push(stack.pop());
    this.grabbedFrom = stack;
};

/**
 * Return a grabbed card to its original stack.
 */
Solitaire.prototype.returnCard = function () {
    if (this.grabbed.length < 1)
        return;
    this.grabbedFrom.push(this.grabbed.pop());
};

/**
 * Return all grabbed cards to the original stack.
 */
Solitaire.prototype.returnAll = function () {
    if (this.grabbed.length < 1)
        return;
    while(this.grabbed.length > 0) {
        this.grabbedFrom.push(this.grabbed.pop());
    }
};

/**
 * Place a set of grabbed cards on a new stack.
 * Check for validity of the placement first.
 */
Solitaire.prototype.placeAll = function (stack) {
    if (this.grabbed.length < 1)
        return;
    while(this.grabbed.length > 0) {
        stack.push(this.grabbed.pop());
    }
};

/**
 * Return TRUE if we've won the game!
 */
Solitaire.prototype.hasWon = function () {
    let allCardsFlipped = true,
        noGrabbedCards  = this.grabbed.length < 1,
        noMoreRemainder = this.remainder[0].length < 1 && this.remainder[1].length < 1;
    for (let i = 0; i < this.lanes.length; i++) {
        for (let j = 0; j < this.lanes[i].length; j++) {
            if (!this.lanes[i][j].flipped)
                allCardsFlipped = false;
        }
    }

    return allCardsFlipped && noMoreRemainder && noGrabbedCards;
};

module.exports = Solitaire;