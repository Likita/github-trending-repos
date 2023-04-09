import { Repo } from '../model/repoList';

export const sortRepoList = (list: Repo[]) => list.sort((a, b) => b.stargazers_count - a.stargazers_count);
