import ActionTypes from "../constants";

const userAuthLogin = (data) => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.USER_AUTH_LOGIN,
      payload: data,
    });
  };
};

const userAuthLogout = (data) => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.USER_AUTH_LOGOUT,
      payload: data,
    });
  };
};

export { userAuthLogin, userAuthLogout };
