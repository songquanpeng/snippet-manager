import axios from 'axios';
import { statusCode } from '../utils/constant';

export const refreshToken = async (setting, dispatch) => {
  let res = await axios.post(`${setting.server}/auth`, {
    username: setting.username,
    password: setting.password,
  });
  if (res) {
    let data = res.data;
    if (data.code === statusCode.statusOk) {
      let token = data.data.token;
      dispatch({ type: 'SET_TOKEN', payload: token });
      return;
    }
  }
  console.log('Failed to refresh token.');
  console.error(res);
};
