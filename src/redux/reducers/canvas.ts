import { Canvas, EDIT_CANVAS } from "../types/actions";
import { CanvasActionTypes, SET_CANVAS } from "../types/actions";

const canvasReducerDefaultState: Canvas = {
    drawerOpen: true,
    drawerLeftMargin: 240,
    drawerClicked: false,
};

const canvasReducer = (state = canvasReducerDefaultState, action: CanvasActionTypes): Canvas => {
    switch (action.type) {
        case EDIT_CANVAS:
            return { ...state, ...action.canvas };
        case SET_CANVAS:
            return action.canvas;
        default:
            return state;
    }
};

export { canvasReducer };
