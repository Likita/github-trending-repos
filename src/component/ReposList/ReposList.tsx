import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import styles from './ReposList.module.css';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { getRepo } from '../../service/getRepo';
import { Repo, RepoList, ViewMode } from '../../model/repoList';
import { sortRepoList } from '../../helper/repoList';

interface IReposList {
  view: ViewMode,
}

function ReposList(props: IReposList) {
  const { view } = props;
  let [repoList, setRepoList] = useState<Array<Repo>>([]);
  let [starList, setStarList] = useState<Array<Repo>>([]);
  let [showList, setShowList] = useState<Array<Repo>>([]);

  useEffect(() => {
    getRepo().then((response: RepoList) => { setRepoList(response.data.items); setShowList(response.data.items) });

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
    (view === ViewMode.starred) && setShowList(starList);
  }, [starList]);

  return (
    <ol className={styles.grid}>
      {showList.map((repo) =>
        <li key={repo.id} className={styles.repo}>
          <a href={repo.html_url} target='_blank' rel='noreferrer' className={styles.link}>{repo.name}</a>
          <br/>
          Owner: {repo.owner.login}
          <br/>
          {repo.description &&
            <>
              {repo.description}
              <br/>
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
                      stargazers_count: repo.stargazers_count
                    })}>
              Star {repo.stargazers_count}
            </Button>
          </Box>
        </li>
      )}
    </ol>
  );
}

export default ReposList;
