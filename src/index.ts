#!/usr/bin/env node
'use strict';

// var term = require("terminal-kit").terminal;
import term from "./terminal";

import GitHelper, { Branch } from "./git-helper";
import { BranchSummary } from "simple-git/typings/response";

const git: GitHelper = new GitHelper();

term.grabInput();

term.on('key', function (name, matches, data) {
    if (name === 'CTRL_C' || name === 'q' || name === 'Q') {
        term.fullscreen(false);
        process.exit();
    }
});

term.fullscreen(true);

term.showBottomMenu();

term.windowTitle("Oh yeah!");

term.red("Hello, folks!\n");

term.blue("It is: " + term.width + "x" + term.height + "\n");

git.readLocalRepos().then((result: Branch[]) => {
    term.blue("Mkay!\n");
    result.forEach((branch: Branch) => {
        term(branch.name);
        term.blue("\t" + (branch.isLocal ? "L" : " "));
        term.green("\t" + (branch.isRemote ? "R" : " "));
        term.red("\t" + (branch.isCurrent ? "C" : " "));
        term.nextLine();
    });
});