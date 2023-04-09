import styles from './App.module.css';
import Header from './component/Header/Header';
import ReposList from './component/ReposList/ReposList';
import { useState } from 'react';
import { ViewMode } from './model/repoList';

function App() {
  let [view, setView] = useState<ViewMode>(ViewMode.all);

  return (
    <div className={styles.wrapper}>
      <Header view={view} setView={setView}></Header>
      <main>
        <ReposList view={view}></ReposList>
      </main>
    </div>
  );
}

export default App;
