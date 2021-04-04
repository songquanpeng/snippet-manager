import SettingDialog from './SettingDialog';
import Token from './Token';
import Setting from './Setting';

// https://stackoverflow.com/questions/59200785/react-usereducer-how-to-combine-multiple-reducers
const combineReducers = (reducers) => {
  return (state, action) => {
    const newState = {};
    for (let key in reducers) {
      newState[key] = reducers[key](state[key], action);
    }
    return newState;
  };
};

export default combineReducers({ SettingDialog, Token, Setting });
