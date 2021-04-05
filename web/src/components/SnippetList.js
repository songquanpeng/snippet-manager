import React, { useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';
import { Paper } from '@material-ui/core';
import { style, toastType } from '../utils/constant';
import { Context } from '../store';
import { refreshSnippetList, refreshTagList } from '../utils/api';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: style.snippetListWidth,
    marginTop: style.topBarHeight,
    position: 'fixed',
    top: 0,
    left: style.tagListWidth,
  },
}));

export default function SnippetList() {
  const [state, dispatch] = useContext(Context);

  useEffect(() => {
    if (state.TagList.length !== 0) {
      (async () => {
        let [ok, message] = await refreshSnippetList(state, dispatch);
        if (!ok) {
          dispatch({
            type: 'SHOW_TOAST',
            payload: {
              message,
              type: toastType.error,
            },
          });
        }
      })();
    }
  }, [state.TagList, state.CurrentTag]);

  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <List>
        {state.SnippetList.map((snippet, index) => (
          <ListItem
            button
            key={snippet.ID}
            component={Link}
            to={`/snippet/${snippet.ID}`}
            onClick={() => {
              dispatch({ type: 'SET_CURRENT_SNIPPET', payload: snippet.ID });
            }}
          >
            <ListItemText primary={snippet.Title} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
