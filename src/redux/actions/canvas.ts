import { Canvas } from "../types/actions";
import { AppActions, SET_CANVAS, EDIT_CANVAS } from "../types/actions";
import { Dispatch } from "redux";
import { AppState } from "../store/storeConfiguration";

export function EditCanvas(canvas: Canvas) {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch({
            type: EDIT_CANVAS,
            canvas,
        });
    };
}

export function SetCanvas(canvas: Canvas) {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch({
            type: SET_CANVAS,
            canvas,
        });
    };
}
