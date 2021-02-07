import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import TopBar from './TopBar';
import TagList from './TagList';
import SnippetList from './SnippetList';
import Snippet from './Snippet';

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
      <TagList />
      <SnippetList />
      <main className={classes.content}>
        <Toolbar />
        <Snippet />
      </main>
    </div>
  );
}

export default Layout;
