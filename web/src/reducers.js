const Reducer = (state, action) => {
  switch (action.type) {
    case 'SET_SETTING':
      return {
        ...state,
        Setting: action.payload,
      };
    case 'SET_SETTING_DIALOG':
      return {
        ...state,
        SettingDialog: action.payload,
      };
    case 'SET_SNIPPET_LIST':
      return {
        ...state,
        SnippetList: action.payload,
      };
    case 'SET_TAG_LIST':
      // TODO: i don't know why it's called twice
      // React useReducer Hook fires twice
      return {
        ...state,
        TagList: action.payload,
      };
    case 'SHOW_TOAST':
      return {
        ...state,
        Toast: {
          ...state.action,
          ...action.payload,
          open: true,
        },
      };
    case 'CLOSE_TOAST':
      return {
        ...state,
        Toast: {
          ...state.action,
          ...action.payload,
          open: false,
        },
      };
    case 'SET_TOKEN':
      return {
        ...state,
        Token: action.payload,
      };
    case 'SET_CURRENT_TAG':
      return {
        ...state,
        CurrentTag: action.payload,
      };
    case 'SET_CURRENT_SNIPPET':
      return {
        ...state,
        CurrentSnippet: action.payload,
      };
    default:
      return state;
  }
};

export default Reducer;
