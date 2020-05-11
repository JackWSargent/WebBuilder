import { Canvas } from "../types/actions";
import { AppActions, SET_CANVAS, EDIT_CANVAS } from "../types/actions";
import { Dispatch } from "redux";
import { AppState } from "../store/storeConfiguration";

export const setCanvas = (canvas: Canvas): AppActions => ({
    type: SET_CANVAS,
    canvas,
});

export const editCanvas = (canvas: Canvas): AppActions => ({
    type: EDIT_CANVAS,
    canvas,
});

export const SetCanvas = (canvas: Canvas) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(setCanvas(canvas));
    };
};

export const EditCanvas = (canvas: Canvas) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(editCanvas(canvas));
    };
};
