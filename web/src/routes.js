import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import NotFoundView from './views/NotFoundView';
import MainView from './views/MainView';

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <MainView /> },
      { path: '*', element: <Navigate to="/404" /> },
    ],
  },
];

export default routes;
