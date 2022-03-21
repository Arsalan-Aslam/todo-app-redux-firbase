import ActionTypes from "../constants";

const INITIAL_STATE = {
  user: null,
};

const userAuthReducer = (state = INITIAL_STATE, action) => {
  if (action.type === ActionTypes.USER_AUTH_LOGIN) {
    return {
      ...state,
      user: true,
    };
  } else if (action.type === ActionTypes.USER_AUTH_LOGOUT) {
    return {
      ...state,
      user: false,
    };
  } else {
    return state;
  }
};

export { userAuthReducer };
