const SettingDialog = (state, action) => {
  switch (action.type) {
    case 'SET_SETTING_DIALOG':
      return {
        open: action.payload,
      };
    default:
      return state;
  }
};

export default SettingDialog;
