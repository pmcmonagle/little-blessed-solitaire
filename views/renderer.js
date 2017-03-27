'use strict';

// Fixme -- maybe these should be global?
const emptyStack = '.',
      whitespace = ' ';

function Renderer() {}

/**
 * Return an output string for the top card in a stack,
 * or emptyStack if the stack is empty.
 */
Renderer.renderTopOfStack = function (stack) {
    return stack.length > 0
        ? stack[stack.length - 1].render()
        : emptyStack;
};

/**
 * Return an output string representing the goal line.
 * This is built using two remainder stacks [[],[]]
 * and four goal stacks [[],[],[],[]];
 */
Renderer.renderGoals = function (goals, remainder) {
    let output = '';
    output += Renderer.renderTopOfStack(remainder[0]);
    output += Renderer.renderTopOfStack(remainder[1]);
    output += whitespace;
    output += Renderer.renderTopOfStack(goals[0]);
    output += Renderer.renderTopOfStack(goals[1]);
    output += Renderer.renderTopOfStack(goals[2]);
    output += Renderer.renderTopOfStack(goals[3]);
    output += '\n';

    return output;
};

/**
 * Returns an output string representing the gameplay lanes.
 */
Renderer.renderLanes = function (lanes) {
    let max = 0,
        output = '';

    lanes.forEach(function (lane) {
        max = Math.max(max, lane.length);
    });

    for (let col = 0; col < max; col++) {
        for (let row = 0; row < lanes.length; row ++) {
            output += lanes[row][col]
                ? lanes[row][col].render()
                : col === 0
                    ? emptyStack
                    : whitespace;
        }
        output += '\n';
    }

    return output;
};

/**
 * Returns an output string representing currently "grabbed"
 * cards. These cards can be thought of as being in your hand.
 */
Renderer.renderGrabbed = function (grabbed) {
    let output = '       \n';
    grabbed.forEach(card => {
        output += card.render();
    });
    output += '\n';

    return output;
};

/**
 * Returns an output string that says "You Won!"
 */
Renderer.renderWin = function () {
    let output = '';
    output += '       \n';
    output += '  you  \n';
    output += '  win  \n';
    output += '  !!!  \n';
    output += '       \n';
    return output;
};

module.exports = Renderer;
