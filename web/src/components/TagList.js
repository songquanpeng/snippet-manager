import React, { useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CodeIcon from '@material-ui/icons/Code';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import { style, toastType } from '../utils/constant';
import { Context } from '../store';
import { loadSetting } from '../utils/setting';
import { Api, refreshTagList } from '../utils/api';

const drawerWidth = style.tagListWidth;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
}));

export default function TagList() {
  const [state, dispatch] = useContext(Context);

  useEffect(() => {
    if (state.Setting.username !== '') {
      (async () => {
        let [ok, message] = await refreshTagList(state, dispatch);
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
  }, [state.Setting]);

  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          {state.TagList.map((tag, index) => (
            <ListItem
              button
              key={tag.Text}
              component={Link}
              to={`/tag/${tag.Text}`}
            >
              <ListItemIcon>
                <CodeIcon />
              </ListItemIcon>
              <ListItemText primary={tag.Text} />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
}
