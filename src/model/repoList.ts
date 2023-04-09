export interface RepoList {
  data: {
    items: Repo[]
  }
}

export interface Repo {
  id: number,
  name: string,
  html_url: string,
  description: string,
  owner: {
    login: string
  },
  stargazers_count: number,
  language: string
}

export enum ViewMode {
  all = 'All',
  starred = 'Starred',
}

export const FilterAllLang = 'All';
