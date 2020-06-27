import { AppActions, History, ADD_HISTORY, UNDO_HISTORY, ENABLE_DISPATCH, REDO_HISTORY } from "../types/actions";
import { Dispatch } from "redux";
import { AppState } from "../store/storeConfiguration";

export const addHistory = (history: History): AppActions => ({
    type: ADD_HISTORY,
    history,
});

export const AddHistory = (history: History) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(addHistory(history));
    };
};

export const undoHistory = (): AppActions => ({
    type: UNDO_HISTORY,
});

export const UndoHistory = () => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(undoHistory());
    };
};

export const redoHistory = (): AppActions => ({
    type: REDO_HISTORY,
});

export const RedoHistory = () => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(redoHistory());
    };
};

export const enableDispatch = (): AppActions => ({
    type: ENABLE_DISPATCH,
});

export const EnableDispatch = () => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(enableDispatch());
    };
};
