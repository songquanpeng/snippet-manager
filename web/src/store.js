import React, { createContext, useReducer } from 'react';
import Reducer from './reducers';
import { toastType } from './utils/constant';

const initialState = {
  SettingDialog: false,
  Token: '',
  Setting: {
    username: '',
    password: '',
    server: 'https://code-snippet-manager.herokuapp.com',
  },
  Toast: {
    open: false,
    message: '',
    duration: 5000,
    type: toastType.info,
  },
  TagList: [],
  SnippetList: [],
  CurrentTag: '',
  CurrentSnippet: '',
};

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};

export const Context = createContext(initialState);
export default Store;
