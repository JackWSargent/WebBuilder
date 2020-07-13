import { createStore, applyMiddleware, compose } from "redux";
// import { combineReducers } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { componentReducer } from "../reducers/component";
import { AppActions } from "../types/actions";
import { canvasStylingReducer } from "../reducers/canvasStyling";
import { canvasReducer } from "../reducers/canvas";
import { clipboardReducer } from "../reducers/clipboard";
import { historyReducer } from "../reducers/history";
import { keyPressReducer } from "../reducers/keyPress";

// export const rootReducer = combineReducers({
//     components: componentReducer,
//     canvasStyling: canvasStylingReducer,
//     canvas: canvasReducer,
//     clipboard: clipboardReducer,
//     history: historyReducer,
//     keyPress: keyPressReducer,
// });

export const rootReducer = (state: any = {}, action) => {
    const historyState = state.history;
    return {
        components: componentReducer(state.components, { ...action, historyState }),
        canvasStyling: canvasStylingReducer(state.canvasStyling, { ...action, historyState }),
        canvas: canvasReducer(state.canvas, { ...action, historyState }),
        clipboard: clipboardReducer(state.clipboard, action),
        history: historyReducer(state.history, action),
        keyPress: keyPressReducer(state.keyPress, action),
    };
};

const composeEnhancers =
    ((window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, traceLimit: 25 })) ||
    compose;
export type AppState = ReturnType<typeof rootReducer>;

export const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk as ThunkMiddleware<AppState, AppActions>))
);
