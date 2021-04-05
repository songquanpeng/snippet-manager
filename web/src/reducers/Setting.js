const Setting = (state, action) => {
  console.log('called: ', state, action);

  switch (action.type) {
    case 'SET_SETTING':
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};

export default Setting;
