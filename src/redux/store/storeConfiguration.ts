import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { componentReducer } from "../reducers/component";
import { AppActions } from "../types/actions";
import { canvasStylingReducer } from "../reducers/canvasStyling";
import { canvasReducer } from "../reducers/canvas";

// import { composeWithDevTools } from "redux-devtools-extension";

export const rootReducer = combineReducers({
    component: componentReducer,
    canvasStyling: canvasStylingReducer,
    canvas: canvasReducer,
});
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export type AppState = ReturnType<typeof rootReducer>;

export const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk as ThunkMiddleware<AppState, AppActions>))
);
