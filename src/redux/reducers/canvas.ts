import { Canvas } from "../types/actions";
import { CanvasActionTypes, SET_CANVAS } from "../types/actions";

const canvasReducerDefaultState: Canvas[] = [
    {
        drawerOpen: true,
        drawerLeftMargin: 240,
        drawerClicked: false,
    },
];

const canvasReducer = (state = canvasReducerDefaultState, action: CanvasActionTypes): Canvas[] => {
    switch (action.type) {
        case SET_CANVAS:
            // console.log("setting canvas");
            return action.canvas;
        default:
            return state;
    }
};

export { canvasReducer };
