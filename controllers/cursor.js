'use strict';

const colNumber     = 6,
      upString      = '^',
      downString    = '˅';

function Cursor (view) {
    this.onInput = function () {};
    this.onUndo  = function () {};
    this.inputHandlers = [
        // col: [ up action, down action ]
        [() => {}, () => {}],
        [() => {}, () => {}],
        [() => {}, () => {}],
        [() => {}, () => {}],
        [() => {}, () => {}],
        [() => {}, () => {}],
        [() => {}, () => {}]
    ];

    this.col = 0;
	this.directionUp = true;
    view.key(['left', 'h'], () => {
        this.col = Math.max(0, this.col - 1);
        this.onInput();
    });
    view.key(['right', 'l'], () => {
        this.col = Math.min(colNumber, this.col + 1);
        this.onInput();
    });
    view.key(['up', 'k'], () => {
		this.directionUp = true;
        this.onInput();
    });
    view.key(['down', 'j'], () => {
		this.directionUp = false;
        this.onInput();
    });
    view.key(['enter', 'space'], () => {
        let direction = this.directionUp
            ? 0 : 1;
        this.inputHandlers[this.col][direction]();
        this.onInput();
    });
    view.key(['delete', 'backspace'], () => {
        this.onUndo();
        this.onInput();
    });
}

/**
 * Return the output string for this object.
 * @return {string}
 */
Cursor.prototype.render = function () {
    let output    = '',
		direction = this.directionUp
			? upString
			: downString;
    for (let i = 0; i < colNumber + 1; i++) {
        output += i === this.col
            ? direction
            : ' ';
    }

    return output;
};

module.exports = Cursor;
