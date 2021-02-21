import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CodeIcon from '@material-ui/icons/Code';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import constant from '../utils/constant';

const drawerWidth = constant.tagListWidth;

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

let tags = [
  { text: 'C++', link: 'Cpp' },
  { text: 'Java', link: 'Java' },
  { text: 'Python', link: 'Python' },
  { text: 'JavaScript', link: 'JavaScript' },
  { text: 'Go', link: 'Go' },
];

export default function TagList() {
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
          {tags.map((tag, index) => (
            <ListItem button key={tag.link} component={Link} to={`/tag/${tag.link}`}>
              <ListItemIcon>
                <CodeIcon />
              </ListItemIcon>
              <ListItemText primary={tag.text} />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
}
