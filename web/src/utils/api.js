import axios from 'axios';
import { statusCode } from './constant';
import { sleep } from './utils';
import { toastType } from './constant';

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
      console.log('Change SET_TAG_LIST');
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