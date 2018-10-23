#!/usr/bin/env node
'use strict';

// var term = require("terminal-kit").terminal;
import term from "./terminal";

import GitHelper, { Branch } from "./git-helper";
import { BranchSummary } from "simple-git/typings/response";

const git: GitHelper = new GitHelper();

const PROGESS_AFTER_FETCH: number = 10;
const TITLE: string = "Git Cleanup";

let exitAsap: boolean = false;

let branches: Branch[] = [];

class ViewableArea {
    private _totalLines: number = 0;
    private _from: number = 0;

    public get from(): number {
        return this._from;
    }

    public set from(newFrom: number) {
        this._from = newFrom;   
    }

    public get totalLines():number {
        return this._totalLines;
    }

    public set totalLines(lines: number) {
        this._totalLines = lines;
    }

    public get to(): number {
        let to: number = this._from + this.getViewableLines() - 1;
        return to < this._totalLines ? to : this._totalLines - 1;
    }

    private getViewableLines(): number {
        return term.height - 2;
    }

    public movePage(pageMove: number): void {
        this.moveLines(pageMove * this.getViewableLines());
    }

    public moveLines(linesMove: number): void {
        this._from += linesMove;
        
        while (((this._from + this.getViewableLines() - 1) >= this._totalLines) && this._from > 0) {
            this._from--;
        }

        if (this._from < 0) {
            this._from = 0;
        }
    }

    public canMoveUp(): boolean {
        return viewableArea._from > 0;
    }

    public canMoveDown(): boolean {
        return viewableArea.to < (viewableArea._totalLines - 1);
    }
}

let viewableArea: ViewableArea = new ViewableArea();

function init(): void {
    term.fullscreen(true);
    term.windowTitle("Oh yeah!");
    
    showTitle();
    
    loadRepositories();
}

function showTitle(): void {
    let textStartPos: number = Math.ceil((term.width - TITLE.length + 1) / 2);
    if (textStartPos < 1) {
        textStartPos = 1;
    }

    for (let i = 1; i <= textStartPos - 2; i++) {
        term.white("#");
    }

    term.column(textStartPos);
    term.bold.brightBlue(TITLE);
    term.right(1);

    for (let i = textStartPos + TITLE.length + 1; i <= term.width; i++) {
        term.white("#");
    }

    term.nextLine();
}

function initControls(): void {
    term.grabInput();

    term.on('key', function (name: string, matches: any, data: any) {
        if (name === 'CTRL_C' || name === 'q' || name === 'Q') {
            exitAsap = true;
            term.fullscreen(false);
            process.exit();
        
        } else if (name === 'UP') {
            if (viewableArea.canMoveUp()) {
                viewableArea.moveLines(-1);
                refreshDisplay();
            }
        
        } else if (name === 'DOWN') {
            if (viewableArea.canMoveDown()) {
                viewableArea.moveLines(1);
                refreshDisplay();
            }
        
        } else if (name === 'PAGE_UP') {
            if (viewableArea.canMoveUp()) {
                viewableArea.movePage(-1);
                refreshDisplay();
            }
        
        } else if (name === 'PAGE_DOWN') {
            if (viewableArea.canMoveDown()) {
                viewableArea.movePage(1);
                refreshDisplay();
            }
        
        } else {
            console.log(name);
        }
    });
}

function loadRepositories(): void {
    term.showProgess(0);

    git.readLocalRepos().then((result: Branch[]) => {
        branches = result;

        term.showProgess(PROGESS_AFTER_FETCH);

        viewableArea.totalLines = result.length;
        viewableArea.from = 0;

        for (let i = 0; i < result.length; i++) {
            /*
            const branch: Branch = result[i];
            
            term(branch.name);
            term.blue("\t" + (branch.isLocal ? "L" : " "));
            term.green("\t" + (branch.isRemote ? "R" : " "));
            term.red("\t" + (branch.isCurrent ? "C" : " "));
            term.nextLine();
            */

            const percentage: number = (i + 1) * (100 - PROGESS_AFTER_FETCH) / result.length + PROGESS_AFTER_FETCH;

            term.showProgess(percentage);

            sleep(50);
        }

        initControls();
        refreshDisplay();
    });
}

function refreshDisplay(): void {
    showBranches();
    showBottomMenu();
}

function showBranches(): void {
    term.moveTo(1, 2);
    term.eraseDisplayBelow();

    for (let i = viewableArea.from; i <= viewableArea.to; i++) {
        const branch: Branch = branches[i];
        showBranch(branch);
    }
}

function showBranch(branch: Branch): void {
    term(branch.name);
    term.blue("\t" + (branch.isLocal ? "L" : " "));
    term.green("\t" + (branch.isRemote ? "R" : " "));
    term.red("\t" + (branch.isCurrent ? "C" : " "));
    term.nextLine();
}

function showBottomMenu(): void {
    term.showInBottomLine(() => {
        term.bgBrightWhite.brightRed("Q");
        term.white("uit");

        term.right(2);

        if (viewableArea.canMoveUp()) {
            term.bgBrightWhite();
            term.brightRed();
        } else {
            term.bgDefaultColor();
            term.gray();
        }
        term("PgUp");

        term.right(2);

        if (viewableArea.canMoveDown()) {
            term.bgBrightWhite();
            term.brightRed();
        } else {
            term.bgDefaultColor();
            term.gray();
        }
        term("PgDn");

        term.styleReset();

        term.right(2);

        term.brightWhite(`${viewableArea.from + 1} - ${viewableArea.to + 1} / ${viewableArea.totalLines}`);
    });
}

init();

// For testing only
function sleep(ms: number): void {
    var date: number = Date.now();
    var curDate: number = Date.now();
    do {
        curDate = Date.now();
    } while ((curDate - date) < ms);
}