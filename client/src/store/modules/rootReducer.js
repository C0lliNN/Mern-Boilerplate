import { combineReducers } from 'redux';
import auth from './auth/reducer';

const appReducer = combineReducers({
  auth,
});

export default appReducer;
