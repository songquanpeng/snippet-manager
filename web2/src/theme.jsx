import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';

const mainTheme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: red,
  },
});

const editorTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#fbf1d3',
    },
    secondary: {
      main: '#fbf6e3',
    },
  },
});

export { mainTheme, editorTheme };
