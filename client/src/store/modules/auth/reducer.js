/* eslint-disable no-param-reassign */
import produce from 'immer';

import * as actionTypes from './types';

const initialState = {
  isLoading: false,
  error: null,
  token: null,
  user: null,
};

export default produce((draft, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      draft.isLoading = true;
      break;
    case actionTypes.AUTH_SUCCESS:
      draft.isLoading = false;
      draft.user = {
        id: action.payload.id,
        name: action.payload.name,
        email: action.payload.email,
      };
      draft.token = action.payload.token;
      break;
    case actionTypes.AUTH_FAILED:
      draft.isLoading = false;
      draft.error = action.error;
      break;
    case actionTypes.AUTH_LOGOUT:
      draft.isLoading = false;
      draft.token = null;
      draft.error = null;
      break;
    default:
  }
}, initialState);
