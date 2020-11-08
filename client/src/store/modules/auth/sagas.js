import { takeLatest, call, put, all } from 'redux-saga/effects';
import api from '../../../services/api';
import * as actionTypes from './types';
import { authFailed, authSuccess } from './action';

function* login(action) {
  try {
    const { data } = yield call(api.post, '/login', action.payload);
    yield put(authSuccess(data));
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    yield put(authFailed(errorMessage));
  }
}

function* signup(action) {
  try {
    const { data } = yield call(api.post, '/signup', action.payload);
    yield put(authSuccess(data));
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    yield put(authFailed(errorMessage));
  }
}

export default all([
  takeLatest(actionTypes.LOGIN_REQUEST, login),
  takeLatest(actionTypes.SIGNUP_REQUEST, signup),
]);
