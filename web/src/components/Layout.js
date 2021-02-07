import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import TagDrawer from './TagDrawer';
import TopBar from './TopBar';
import MainView from '../views/MainView';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function Layout() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <TopBar />
      <TagDrawer />
      <main className={classes.content}>
        <Toolbar />
        <MainView />
      </main>
    </div>
  );
}

export default Layout;
