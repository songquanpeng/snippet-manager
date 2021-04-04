import axios from 'axios';
import { statusCode } from '../utils/constant';

export const refreshToken = async (setting, dispatch) => {
  try {
    let res = await axios.post(`${setting.server}/auth`, {
      username: setting.username,
      password: setting.password,
    });
    let data = res.data;
    if (data.code === statusCode.statusOk) {
      let token = data.data.token;
      dispatch({ type: 'SET_TOKEN', payload: token });
      return [true, ''];
    } else {
      return [false, `Failed to refresh token: code ${data.code}.`];
    }
  } catch (e) {
    console.error(e);
    return [false, `Failed to refresh token: ${e.message}.`];
  }
};
