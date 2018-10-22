import * as simplegit from 'simple-git/promise';
import { BranchSummary } from 'simple-git/typings/response';
import { Options } from 'simple-git/promise';
import { stringify } from 'querystring';

const git: simplegit.SimpleGit = simplegit("./");

const remoteBranchPrefix: string = "remotes/origin/"

export interface Branch {
    name: string,
    isCurrent: boolean,
    isLocal: boolean,
    isRemote: boolean
}

export default class GitHelper {
    public async readLocalRepos(): Promise<Branch[]> {
        await git.fetch(["-p"]);

        const summary: BranchSummary = await git.branch({
            '-a': undefined,
            '-v': undefined
        } as Options);

        const branchesMap: Map<string, Branch> = new Map<string, Branch>();
        summary.all.forEach((name: string) => {
            let branchName: string = name;

            const isRemote: boolean = name.indexOf(remoteBranchPrefix) === 0;
            const isCurrent: boolean = name === summary.current;

            if (isRemote) {
                branchName = branchName.substring(remoteBranchPrefix.length);
            }

            let branch: Branch | undefined = branchesMap.get(branchName);
            if (branch === undefined) {
                branchesMap.set(branchName, { name: branchName, isLocal: false, isRemote: false } as Branch);
                branch = branchesMap.get(branchName);
            }

            if (branch) {
                if (isRemote) {
                    branch.isRemote = true;
                } else {
                    branch.isLocal = true;
                }

                branch.isCurrent = isCurrent;
            }
        });

        return Array.from(branchesMap.values()).sort((b1, b2) => {
            return b1.name.localeCompare(b2.name);
        });
    }
}