import { CanvasStyling } from "../types/actions";
import { CanvasStylingActionTypes, SET_CANVAS_STYLING } from "../types/actions";

const canvasStylingReducerDefaultState: CanvasStyling[] = [
  {
    fontSize: 16,
    boxSizing: "border-box"
  }
];

const canvasStylingReducer = (
  state = canvasStylingReducerDefaultState,
  action: CanvasStylingActionTypes
): CanvasStyling[] => {
  switch (action.type) {
    case SET_CANVAS_STYLING:
      return action.canvasStyling;
    default:
      return state;
  }
};

export { canvasStylingReducer };
