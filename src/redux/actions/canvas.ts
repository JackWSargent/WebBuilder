import { Canvas } from "../types/actions";
import { AppActions, SET_CANVAS } from "../types/actions";
import { Dispatch } from "redux";
import { AppState } from "../store/storeConfiguration";

export const setCanvas = (canvas: Canvas[]): AppActions => ({
  type: SET_CANVAS,
  canvas
});

export const startSetCanvas = (canvas: Canvas[]) => {
  return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    dispatch(setCanvas(canvas));
  };
};
