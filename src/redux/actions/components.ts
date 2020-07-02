import {
    AppActions,
    Component,
    Undo,
    Redo,
    SET_COMPONENTS,
    DELETE_COMPONENT,
    ADD_COMPONENT,
    EDIT_COMPONENT,
    EDIT_COMPONENTS,
    PASTE_COMPONENT,
    UNDO_COMPONENT,
    REDO_COMPONENT,
} from "../types/actions";
import { Dispatch } from "redux";
import { AppState } from "../store/storeConfiguration";
import { store } from "../store/storeConfiguration";

export const setComponents = (components: Component[]): AppActions => ({
    type: SET_COMPONENTS,
    components,
});

export const deleteComponent = (component: Component): AppActions => ({
    type: DELETE_COMPONENT,
    component,
});

export const addComponent = (component: Component): AppActions => ({
    type: ADD_COMPONENT,
    component,
});

export const editComponent = (component: Component): AppActions => ({
    type: EDIT_COMPONENT,
    component,
});

export const editComponents = (components: Component[]): AppActions => ({
    type: EDIT_COMPONENTS,
    components,
});

export const pasteComponent = (id: number): AppActions => ({
    type: PASTE_COMPONENT,
    id,
});

// export const undoComponent = (undo: Undo[]): AppActions => ({
//     type: UNDO_COMPONENT,
//     undo,
// });

export const redoComponent = (redo: Redo[]): AppActions => ({
    type: REDO_COMPONENT,
    redo,
});

export const SetComponents = (components: Component[]) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(setComponents(components));
    };
};

export const DeleteComponent = (component: Component) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(deleteComponent(component));
    };
};

export const AddComponent = (component: Component) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(addComponent(component));
    };
};

export const EditComponent = (component: Component) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(editComponent(component));
    };
};

export const EditComponents = (components: Component[]) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(editComponents(components));
    };
};

export const PasteComponent = (id: number) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(pasteComponent(id));
    };
};

// export const UndoComponent = (undo: Undo[]) => {
//     return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
//         dispatch(undoComponent(undo));
//     };
// };

export function UndoComponent(undo: Undo[]) {
    return (dispatch, getState) => {
        let reduxStore = store.getState();
        let historyStore = reduxStore.history;
        console.log(historyStore);
        dispatch({
            type: UNDO_COMPONENT,
            undo,
            history: historyStore,
        });
    };
}

export const RedoComponent = (redo: Redo[]) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(redoComponent(redo));
    };
};
