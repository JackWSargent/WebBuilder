import {
    AppActions,
    History,
    Redo,
    // Undo,
    ADD_HISTORY,
    UNDO_HISTORY,
    ENABLE_DISPATCH,
    REDO_HISTORY,
    ADD_REDO_HISTORY,
    Component,
} from "../types/actions";
import { Dispatch } from "redux";
import { AppState } from "../store/storeConfiguration";

export const addHistory = (history: History, components?: Component[]): AppActions => ({
    type: ADD_HISTORY,
    history,
    components,
});

export const AddHistory = (history: History, components?: Component[]) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(addHistory(history, components));
    };
};

export const addRedoHistory = (history: History): AppActions => ({
    type: ADD_REDO_HISTORY,
    history,
});

export const AddRedoHistory = (history: History) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(addRedoHistory(history));
    };
};

export const undoHistory = (redo: Redo): AppActions => ({
    type: UNDO_HISTORY,
    redo,
});

export const UndoHistory = (redo: Redo) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(undoHistory(redo));
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
