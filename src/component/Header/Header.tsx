import StarIcon from '@mui/icons-material/Star';
import { Button } from "@mui/material";
import styles from './Header.module.css';
import { ViewMode } from '../../model/repoList';

interface IHeader {
  view: ViewMode,
  setView: Function,
}

function Header(props: IHeader) {
  const { view, setView } = props;

  return (
    <header className={styles.header}>
      Filter:
      <Button variant={view === ViewMode.all ? 'contained' : 'outlined'}
              onClick={() => setView(ViewMode.all)}>
        {ViewMode.all}
      </Button>
      <Button variant={view === ViewMode.starred ? 'contained' : 'outlined'}
              startIcon={<StarIcon />}
              onClick={() => setView(ViewMode.starred)}>
        {ViewMode.starred}
      </Button>
    </header>
  );
}

export default Header;
