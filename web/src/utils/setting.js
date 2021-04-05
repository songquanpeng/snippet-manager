export function loadSetting(dispatch) {
  let username = localStorage.getItem('username');
  let password = localStorage.getItem('password');
  let server = localStorage.getItem('server');
  if (!username || !password || !server) {
    dispatch({ type: 'SET_SETTING_DIALOG', payload: true });
  } else {
    dispatch({
      type: 'SET_SETTING',
      payload: {
        username,
        password,
        server,
      },
    });
  }
}

export function saveSetting(setting, dispatch) {
  // Close the setting dialog.
  dispatch({ type: 'SET_SETTING_DIALOG', payload: false });
  // Save to local storage
  for (const [key, value] of Object.entries(setting)) {
    localStorage.setItem(key, value);
  }
  // Save to global state
  dispatch({ type: 'SET_SETTING', payload: setting });
}
