import { combineReducers } from 'redux';

import settingsReducer from './settings.reducer';
import feedpostsReducer from './feedposts.reducer';


export default combineReducers({
    settings: settingsReducer,
    feedposts: feedpostsReducer
})