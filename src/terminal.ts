var term = require("terminal-kit").terminal;

term.foo = () => {
    term.moveTo.red(10, 10, "Alrighty then!\n");
};

term.showBottomMenu = () => {
    term.saveCursor();
    term.moveToBottomLine();
    term.bgWhite.red("Q");
    term.white("uit");
    term.restoreCursor();
};

term.moveToBottomLine = () => {
    term.moveTo(1, term.height);
};

export default term;