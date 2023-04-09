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
  let [starList, setStarList] = useState<Array<Repo>>([]);
  let [showList, setShowList] = useState<Array<Repo>>([]);
  let [langList, setLangList] = useState<Set<string>>(new Set());
  let [filterLang, setFilterLang] = useState<string>(FilterAllLang);

  useEffect(() => {
    getRepo().then((response: RepoList) => {
      setRepoList(response.data.items);
      setShowList(response.data.items);
      setLangList(response.data.items.reduce((langList: Set<string>, repo: Repo) => repo.language ? langList.add(repo.language) : langList, new Set()));
    });

    const newStarList:Repo[] = [];
    for (const key in localStorage) {
      if (key.includes('starred-repo-')) {
        newStarList.push(JSON.parse(localStorage[key]));
      }
    }
    setStarList(sortRepoList(newStarList));
  }, []);

  useEffect(() => {
    (view === ViewMode.all) ?  setShowList(repoList) : setShowList(starList);
    setFilterLang(FilterAllLang);
  }, [view]);

  const onStar = (repo: Repo) => {
    const storedId = `starred-repo-${repo.id}`;
    if (localStorage.getItem(storedId)) {
      localStorage.removeItem(storedId);
      const newStarList = starList.filter((a) => a.id !== repo.id);
      setStarList(newStarList);
    } else {
      localStorage.setItem(storedId, JSON.stringify(repo));
      setStarList(sortRepoList([...starList, repo]));
    }
  }

  useEffect(() => {
    if (view === ViewMode.starred) {
      setShowList(starList);
      setFilterLang(FilterAllLang);
    };
  }, [starList]);

  const onFilterLang = (lang: string) => {
    const basicData = (view === ViewMode.all) ? repoList : starList;
    setFilterLang(lang);
    if (lang === FilterAllLang) {
      setShowList(basicData);
    } else {
      setShowList(basicData.filter((repo) => repo.language === lang));
    }
  }

  return (
    <>
      <div className={styles.filterPanel}>
        Language filter:
        <Button variant={filterLang === FilterAllLang ? 'contained' : 'outlined'}
                onClick={() => onFilterLang(FilterAllLang)}>
          {FilterAllLang}
        </Button>
        {Array.from(langList).map((lang, index) =>
          <Button key={`lang-${index}`}
                  variant={filterLang === lang ? 'contained' : 'outlined'}
                  onClick={() => onFilterLang(lang)}>
            {lang}
          </Button>
        )}
      </div>
      <ol className={styles.grid}>
        {showList.map((repo) =>
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
                      onClick={() => onStar({
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
