import { CanvasStyling } from "../types/actions";
import { AppActions, SET_CANVAS_STYLING, UNDO_CANVAS_STYLING, REDO_CANVAS_STYLING } from "../types/actions";
import { Dispatch } from "redux";
import { AppState } from "../store/storeConfiguration";

export function SetCanvasStyling(canvasStyling: CanvasStyling) {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch({
            type: SET_CANVAS_STYLING,
            canvasStyling,
        });
    };
}

export function UndoCanvasStyling(canvasStyling: CanvasStyling) {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch({
            type: UNDO_CANVAS_STYLING,
            canvasStyling,
        });
    };
}

export function RedoCanvasStyling(canvasStyling: CanvasStyling) {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch({
            type: REDO_CANVAS_STYLING,
            canvasStyling,
        });
    };
}
