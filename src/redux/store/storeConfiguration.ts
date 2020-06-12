import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { componentReducer } from "../reducers/component";
import { AppActions } from "../types/actions";
import { canvasStylingReducer } from "../reducers/canvasStyling";
import { canvasReducer } from "../reducers/canvas";
import { clipboardReducer } from "../reducers/clipboard";
import { historyReducer } from "../reducers/history";
import { keyPressReducer } from "../reducers/keyPress";

// import { composeWithDevTools } from "redux-devtools-extension";

export const rootReducer = combineReducers({
    components: componentReducer,
    canvasStyling: canvasStylingReducer,
    canvas: canvasReducer,
    clipboard: clipboardReducer,
    history: historyReducer,
    keyPress: keyPressReducer,
});
const composeEnhancers =
    ((window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, traceLimit: 25 })) ||
    compose;
export type AppState = ReturnType<typeof rootReducer>;

export const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk as ThunkMiddleware<AppState, AppActions>))
);
