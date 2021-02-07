import React from 'react';
import { useRoutes } from 'react-router-dom';

import { ThemeProvider } from '@material-ui/core';
import { mainTheme } from './theme';
import routes from './routes';

const App = () => {
  const routing = useRoutes(routes);
  return <ThemeProvider theme={mainTheme}>{routing}</ThemeProvider>;
};

export default App;
