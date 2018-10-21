import * as simplegit from 'simple-git/promise';
import { BranchSummary } from 'simple-git/typings/response';

const git: simplegit.SimpleGit = simplegit("./");

export interface Branch {
    name: string,
    isCurrent: boolean,
    isLocal: boolean,
    isRemote: boolean
}

export default class GitHelper {
    public async readLocalRepos(): Promise<Branch[]> {
        const result: BranchSummary = await git.branch(null);

        const branches: Branch[] = [];
        result.all.forEach((name: string) => {
            branches.push({
                name,
                isLocal: false,
                isRemote: false,
                isCurrent: name === result.current
            });
        });

        return Promise.resolve(branches);
    }
}