import {
    AppActions,
    Component,
    SET_COMPONENTS,
    DELETE_COMPONENT,
    ADD_COMPONENT,
    EDIT_COMPONENT,
    EDIT_COMPONENTS,
    PASTE_COMPONENT,
} from "../types/actions";
import { Dispatch } from "redux";
import { AppState } from "../store/storeConfiguration";

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
