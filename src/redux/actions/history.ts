import {
    AppActions,
    History,
    Redo,
    // Undo,
    ADD_HISTORY,
    UNDO_HISTORY,
    ENABLE_DISPATCH,
    REDO_HISTORY,
} from "../types/actions";
import { Dispatch } from "redux";
import { AppState } from "../store/storeConfiguration";

export function AddHistory(history: History) {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch({
            type: ADD_HISTORY,
            history,
        });
    };
}

export function UndoHistory(redo: Redo) {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch({
            type: UNDO_HISTORY,
            redo,
        });
    };
}

export function RedoHistory() {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch({
            type: REDO_HISTORY,
        });
    };
}

export function EnableDispatch() {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch({
            type: ENABLE_DISPATCH,
        });
    };
}
