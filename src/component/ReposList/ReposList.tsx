import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import styles from './ReposList.module.css';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { getRepo } from '../../service/getRepo';
import { Repo, RepoList, ViewMode, FilterAllLang } from '../../model/repoList';
import { sortRepoList } from '../../helper/repoList';
interface IReposList {
  view: ViewMode,
}

function ReposList(props: IReposList) {
  const { view } = props;
  let [repoList, setRepoList] = useState<Array<Repo>>([]);
  let [starIdList, setStarIdList] = useState<Array<number>>([]);
  let [langList, setLangList] = useState<Set<string>>(new Set());
  let [langFilter, setLangFilter] = useState<string>(FilterAllLang);

  useEffect(() => {
    getRepo().then((response: RepoList) => {
      setRepoList(response.data.items);
      setLangList(response.data.items.reduce((langList: Set<string>, repo: Repo) => repo.language ? langList.add(repo.language) : langList, new Set()));
    });

    const newStarIdList = [];
    for (const key in localStorage) {
      if (key.includes('starred-repo-')) {
        newStarIdList.push(+localStorage[key]);
      }
    }
    setStarIdList(newStarIdList);
  }, []);

  const filteredRepoList = (() => {
    const showList = (view === ViewMode.all) ?  repoList : repoList.filter((repo) => starIdList.includes(repo.id));
    if (langFilter === FilterAllLang) return showList;
    return showList.filter((repo) => repo.language === langFilter);
  })();

  const onStarSelect = (repo: Repo) => {
    const storedId = `starred-repo-${repo.id}`;
    if (localStorage.getItem(storedId)) {
      localStorage.removeItem(storedId);
      const newStarList = starIdList.filter((id) => id !== repo.id);
      setStarIdList(newStarList);
    } else {
      localStorage.setItem(storedId, `${repo.id}`);
      setStarIdList([...starIdList, repo.id]);
    }
  }

  const onLangSelect = (lang: string) => setLangFilter(lang)

  return (
    <>
      <div className={styles.filterPanel}>
        Language filter:
        <Button variant={langFilter === FilterAllLang ? 'contained' : 'outlined'}
                onClick={() => onLangSelect(FilterAllLang)}>
          {FilterAllLang}
        </Button>
        {Array.from(langList).map((lang, index) =>
          <Button key={`lang-${index}`}
                  variant={langFilter === lang ? 'contained' : 'outlined'}
                  onClick={() => onLangSelect(lang)}>
            {lang}
          </Button>
        )}
      </div>
      <ol className={styles.grid}>
        {filteredRepoList.map((repo) =>
          <li key={repo.id} className={styles.repo}>
            <a href={repo.html_url} target='_blank' rel='noreferrer' className={styles.link}>{repo.name}</a>
            <br/>
            <span className={styles.label}>Owner:</span> {repo.owner.login}
            {repo.language &&
              <>
                <br/>
                <span className={styles.label}>Language:</span> {repo.language}
              </>
            }

            {repo.description &&
              <>
                <br/>
                {repo.description}
              </>
            }
            <Box mt={1}>
              <Button variant={localStorage.getItem(`starred-repo-${repo.id}`) ? 'contained' : 'outlined'}
                      startIcon={<StarBorderIcon />}
                      onClick={() => onStarSelect({
                        id: repo.id,
                        name: repo.name,
                        html_url: repo.html_url,
                        description: repo.description,
                        owner: {
                          login: repo.owner.login
                        },
                        stargazers_count: repo.stargazers_count,
                        language: repo.language
                      })}>
                Star {repo.stargazers_count}
              </Button>
            </Box>
          </li>
        )}
      </ol>
    </>
  );
}

export default ReposList;
