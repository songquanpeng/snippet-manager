import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';
import { Paper } from '@material-ui/core';
import constant from '../utils/constant';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: constant.snippetListWidth,
    marginTop: constant.topBarHeight,
    position: 'fixed',
    top: 0,
    left: constant.tagListWidth,
  },
}));

let snippets = [
  { text: '通过 window 对象使函数在页面可用', link: 'temp-link-1' },
  { text: '通过构建 HTML 文本来创建并插入元素', link: 'temp-link-2' },
  { text: '通过 API 来创建元素', link: 'temp-link-3' },
  { text: '复制文字到剪切板', link: 'temp-link-4' },
  { text: '打开新的页面', link: 'temp-link-5' },
];

export default function SnippetList() {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <List>
        {snippets.map((snippet, index) => (
          <ListItem
            button
            key={snippet.link}
            component={Link}
            to={`/snippet/${snippet.link}`}
          >
            <ListItemText primary={snippet.text} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
