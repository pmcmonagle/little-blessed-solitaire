'use strict';

const Card     = require('./models/card'),
      Deck     = require('./models/deck'),
      Game     = require('./models/solitaire'),
      Cursor   = require('./controllers/cursor'),
      Renderer = require('./views/renderer'),
      Blessed  = require('blessed'),
      screen   = Blessed.screen({ smartCSR: true }),
      gameView = Blessed.box({
          left:   'center',
          top:    'center',
          width:  '100%',
          height: '100%'
      });

screen.append(gameView);
screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

let cursor    = new Cursor(gameView),
    deck      = new Deck(),
    game      = new Game();

// Shuffle the deck and deal the cards.
deck.shuffle();
game.deal(deck);

// Set up the input handlers for the remainder stacks
cursor.inputHandlers[0][0] = () => game.showNextRemainder();
cursor.inputHandlers[1][0] = () => game.grabFromRemainder();
cursor.onUndo = () => game.returnAll();

// Input handlers for the goal stacks.
for (let i = 0; i < game.goals.length; i++) {
    cursor.inputHandlers[i + 3][0] = () => game.useGoal(game.goals[i]);
}

// Input handlers for the lane stacks.
for (let i = 0; i < game.lanes.length; i++) {
    cursor.inputHandlers[i][1] = () => game.useLane(game.lanes[i]);
}

/**
 * Render the game!
 */
function renderGame (view, lanes, remainder, goals, grabbed) {
    let goalLine    = Renderer.renderGoals(goals, remainder),
        controlLine = cursor.render() + '\n',
        stackLines  = Renderer.renderLanes(lanes),
        grabbedLine = Renderer.renderGrabbed(grabbed);

    view.setContent(goalLine + controlLine + stackLines + grabbedLine);
    screen.render();
}

renderGame(gameView, game.lanes, game.remainder, game.goals, game.grabbed);
cursor.onInput = () => {
    if (game.hasWon()) {
        gameView.setContent(Renderer.renderWin());
        screen.render();
    } else {
        renderGame(gameView, game.lanes, game.remainder, game.goals, game.grabbed);
    }
};
