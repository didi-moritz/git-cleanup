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

function init(): void {
    term.fullscreen(true);
    term.windowTitle("Oh yeah!");
    
    showTitle();
    
    term.color(1, "Servas\n");
    term.white("###ABCDEFG###\n");
    term.brightWhite("###ABCDEFG###\n");
    term.color(15, "###ABCDEFG###\n");
    term.brightRed("Hello, folks!\n");
    term.brightBlue("It is: " + term.width + "x" + term.height + "\n");

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

    term.on('key', function (name, matches, data) {
        if (name === 'CTRL_C' || name === 'q' || name === 'Q') {
            exitAsap = true;
            term.fullscreen(false);
            process.exit();
        }
    });
}

function loadRepositories(): void {
    term.showProgess(0);

    git.readLocalRepos().then((result: Branch[]) => {
        term.showProgess(PROGESS_AFTER_FETCH);

        term.blue("Mkay!\n");
        for (let i = 0; i < result.length; i++) {
            const branch: Branch = result[i];
            term(branch.name);
            term.blue("\t" + (branch.isLocal ? "L" : " "));
            term.green("\t" + (branch.isRemote ? "R" : " "));
            term.red("\t" + (branch.isCurrent ? "C" : " "));
            term.nextLine();

            const percentage: number = (i + 1) * (100 - PROGESS_AFTER_FETCH) / result.length + PROGESS_AFTER_FETCH;

            term.showProgess(percentage);

            sleep(200);
        }
        // result.forEach((branch: Branch) => {
        //     term(branch.name);
        //     term.blue("\t" + (branch.isLocal ? "L" : " "));
        //     term.green("\t" + (branch.isRemote ? "R" : " "));
        //     term.red("\t" + (branch.isCurrent ? "C" : " "));
        //     term.nextLine();
        //     sleep(500);
        // });

        initControls();
        initMenu();
    });
}

function initMenu(): void {
    term.showBottomMenu();
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