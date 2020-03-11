import { CanvasStyling } from "../types/actions";
import { AppActions, SET_CANVAS_STYLING } from "../types/actions";
import { Dispatch } from "redux";
import { AppState } from "../store/storeConfiguration";

export const setCanvasStyling = (
  canvasStyling: CanvasStyling[]
): AppActions => ({
  type: SET_CANVAS_STYLING,
  canvasStyling
});

export const startSetCanvasStyling = (canvasStyling: CanvasStyling[]) => {
  return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    dispatch(setCanvasStyling(canvasStyling));
  };
};
