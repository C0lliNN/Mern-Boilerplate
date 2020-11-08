import Swal from 'sweetalert2';
import * as actionTypes from './types';

export function loginRequest(email, password) {
  return {
    type: actionTypes.LOGIN_REQUEST,
    payload: { email, password },
  };
}

export function signupRequest(name, email, password) {
  return {
    type: actionTypes.SIGNUP_REQUEST,
    payload: { name, email, password },
  };
}

export function authStart() {
  return {
    type: actionTypes.AUTH_START,
  };
}

export function authSuccess(payload) {
  return {
    type: actionTypes.AUTH_SUCCESS,
    payload,
  };
}

export function authFailed(error) {
  Swal.fire('Error!', error, 'error');

  return {
    type: actionTypes.AUTH_FAILED,
    error,
  };
}

export function authLogout() {
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
}
