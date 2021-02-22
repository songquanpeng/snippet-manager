import React from 'react';
import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';

import { ThemeProvider } from '@material-ui/core';
import { mainTheme } from './theme';
import routes from './routes';

const App = () => {
  useEffect(() => {
    const e = document.getElementById('ipl-progress-indicator');
    if (e) {
      e.classList.add('available');
      setTimeout(() => {
        e.outerHTML = '';
      }, 20);
    }
  }, []);
  const routing = useRoutes(routes);
  return <ThemeProvider theme={mainTheme}>{routing}</ThemeProvider>;
};

export default App;