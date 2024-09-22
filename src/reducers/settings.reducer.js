import appGlobalState from '../appconfig';

const settingsReducer = (state = { ...appGlobalState.settings }, action) => {
  
  if (action.type === 'UPDATE_IFRAME_FILTERS') {
    // console.log(action.payload)
    return {
      ...state,
      iframefilters: action.payload
    };
  }

  return state;
};

export default settingsReducer;
