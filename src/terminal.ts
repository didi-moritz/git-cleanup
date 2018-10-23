var term = require("terminal-kit").terminal;

term.centerText = (termChain: any, text: string) => {
    let startPos: number = Math.floor((term.width - text.length) / 2);
    startPos = startPos < 0 ? 0 : startPos;

    term.column(startPos);
    termChain(text);
};

term.showProgess = (percentage: number) => {
    const numberOfDoneChars: number = Math.round((term.width - 2) * percentage / 100);
    const numberOfUndoneChars: number = term.width - 2 - numberOfDoneChars;

    term.showInBottomLine(() => {
        term.white("[");
        for (var i = 0; i < numberOfDoneChars; i++) {
            term.brightWhite("#");
        }
        for (var i = 0; i < numberOfUndoneChars; i++) {
            term.white("-");
        }
        term.white("]");
    });
};

term.showInBottomLine = (displayFunc: () => void) => {
    term.saveCursor();
    term.moveToBottomLine();
    term.eraseLine();
    displayFunc();
    term.restoreCursor();
};

term.moveToBottomLine = () => {
    term.moveTo(1, term.height);
};

export default term;