import appGlobalState from '../appconfig';

const feedpostsReducer = (state = { ...appGlobalState.feedposts }, action) => {
  

    if (action.type === 'FEED_POST_DATA') {
        return {
          ...state,
          data: action.payload,
        };
    }

  return state;
};

export default feedpostsReducer;
