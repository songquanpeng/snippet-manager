import axios from 'axios';
import { statusCode, toastType } from './constant';
import { sleep } from './utils';

let api;

export const refreshToken = async (state, dispatch) => {
  try {
    let res = await axios.post(`${state.Setting.server}/auth`, {
      username: state.Setting.username,
      password: state.Setting.password,
    });
    let data = res.data;
    if (data.code === statusCode.statusOk) {
      let token = data.data.token;
      dispatch({ type: 'SET_TOKEN', payload: token });
      return [true, '', token];
    } else {
      console.log(data);
      return [false, `Failed to refresh token: code ${data.code}.`, undefined];
    }
  } catch (e) {
    console.log(state);
    console.error(e);
    return [false, `Failed to refresh token: ${e.message}.`, undefined];
  }
};

export const Api = async (state, dispatch) => {
  let token = state.Token;
  if (token === '') {
    let [ok, message, newToken] = await refreshToken(state, dispatch);
    if (ok) {
      token = newToken;
    } else {
      dispatch({
        type: 'SHOW_TOAST',
        payload: {
          message,
          type: toastType.error,
        },
      });
    }
  }
  api = axios.create({
    baseURL: state.Setting.server + '/api',
    headers: { Authorization: `Bearer ${token}` },
  });
  return api;
};

export const refreshTagList = async (state, dispatch) => {
  while (!api) {
    // TODO: waiting for state be initialized.
    console.log('refreshTagList waiting');
    await sleep(50);
  }
  try {
    let res = await api.get(`/tags`);
    let data = res.data;
    if (data.code === statusCode.statusOk) {
      let tags = data.data;
      dispatch({ type: 'SET_TAG_LIST', payload: tags });
      return [true, ''];
    } else {
      return [false, `Failed to refresh tag list: ${data.message}.`];
    }
  } catch (e) {
    console.error(e);
    return [false, `Failed to refresh tag list: ${e.message}.`];
  }
};

export const refreshSnippetList = async (state, dispatch) => {
  let id = state.CurrentTag;
  if (id === '') {
    id = state.TagList[0].ID;
  }
  try {
    let res = await api.get(`/tag/${id}`);
    let data = res.data;
    if (data.code === statusCode.statusOk) {
      let snippets = data.data;
      if (snippets === null) {
        snippets = [];
      }
      dispatch({ type: 'SET_SNIPPET_LIST', payload: snippets });
      return [true, ''];
    } else {
      return [false, `Failed to refresh snippet list: ${data.message}.`];
    }
  } catch (e) {
    console.error(e);
    return [false, `Failed to refresh snippet list: ${e.message}.`];
  }
};

export const getSnippet = async (state) => {
  while (!api) {
    // TODO: waiting for state be initialized.
    await sleep(50);
  }
  let id = state.CurrentSnippet;
  if (id !== '') {
    try {
      let res = await api.get(`/snippet/${id}`);
      let data = res.data;
      if (data.code === statusCode.statusOk) {
        return [true, data.data.snippet];
      } else {
        console.error(`Failed to fetch snippet: ${data.message}.`);
      }
    } catch (e) {
      console.error(e);
    }
  }
  return [false, undefined];
};

export const updateSnippet = async (snippet, isNewSnippet) => {
  if (isNewSnippet === undefined) {
    isNewSnippet = false;
  }
  let ok = false;
  let message = '';
  try {
    let res = isNewSnippet
      ? await api.post(`/snippet`, snippet)
      : await api.put(`/snippet`, snippet);
    let data = res.data;
    if (data.code === statusCode.statusOk) {
      ok = true;
    }
    message = data.message;
  } catch (e) {
    console.error(e);
    message = e;
  }
  return [ok, message];
};

export const deleteSnippet = async (id) => {
  let ok = false;
  let message = '';
  try {
    let res = await api.delete(`/snippet/${id}`);
    let data = res.data;
    if (data.code === statusCode.statusOk) {
      ok = true;
    }
    message = data.message;
  } catch (e) {
    console.error(e);
    message = e;
  }
  return [ok, message];
};
