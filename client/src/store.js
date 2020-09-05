import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import setAuthToken from "./utils/setAuthToken";

const initialState = {}; //여기에 알람부터 모든 state 쌓이는가

const middleWare = [thunk]; //?

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleWare)) //?
);

let currentState = store.getState();
store.subscribe(() => {
  let previousState = currentState;
  currentState = store.getState();
  if (previousState.auth.token !== currentState.auth.token) {
    const token = currentState.auth.token;
    setAuthToken(token);
  }
});

export default store;