import {
    AppActions,
    Component,
    CopiedComponent,
    Undo,
    Redo,
    SET_COMPONENTS,
    DELETE_COMPONENT,
    ADD_COMPONENT,
    EDIT_COMPONENT,
    EDIT_COMPONENTS,
    PASTE_COMPONENT,
    UNDO_COMPONENT,
    UNDO_COMPONENTS,
    UNDO_DELETE_COMPONENTS,
    REDO_COMPONENT,
} from "../types/actions";
import { Dispatch } from "redux";
import { AppState } from "../store/storeConfiguration";
import { store } from "../store/storeConfiguration";

export function SetComponents(components: Component[]) {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch({
            type: SET_COMPONENTS,
            components,
        });
    };
}

export function DeleteComponent(component: Component) {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch({
            type: DELETE_COMPONENT,
            component,
        });
    };
}

export function AddComponent(component: Component) {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch({
            type: ADD_COMPONENT,
            component,
        });
    };
}

export function EditComponent(component: Component) {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch({
            type: EDIT_COMPONENT,
            component,
        });
    };
}

export function EditComponents(components: Component[]) {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch({
            type: EDIT_COMPONENTS,
            components,
        });
    };
}

export function PasteComponent(id: number, copiedComponent: CopiedComponent) {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch({
            type: PASTE_COMPONENT,
            id,
            copiedComponent,
        });
    };
}

export function UndoComponent(undo: Undo[]) {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        let reduxStore = store.getState();
        let historyStore = reduxStore.history;
        dispatch({
            type: UNDO_COMPONENT,
            undo,
            history: historyStore,
        });
    };
}

export function UndoComponents(undo: Undo[]) {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        let reduxStore = store.getState();
        let historyStore = reduxStore.history;
        dispatch({
            type: UNDO_COMPONENTS,
            undo,
            history: historyStore,
        });
    };
}

export function UndoDeleteComponents(undo: Undo[]) {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        let reduxStore = store.getState();
        let historyStore = reduxStore.history;
        dispatch({
            type: UNDO_DELETE_COMPONENTS,
            undo,
            history: historyStore,
        });
    };
}

export function RedoComponent(redo: Redo[]) {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        let reduxStore = store.getState();
        let historyStore = reduxStore.history;
        dispatch({
            type: REDO_COMPONENT,
            redo,
            history: historyStore,
        });
    };
}
