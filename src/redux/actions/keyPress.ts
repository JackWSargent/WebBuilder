import { AppActions, KeyPress, KEY_DOWN, KEY_UP } from "../types/actions";
import { Dispatch } from "redux";
import { AppState } from "../store/storeConfiguration";

export const keyUp = (keyPress: KeyPress): AppActions => ({
    type: KEY_UP,
    keyPress,
});

export const KeyUp = (keyPress: KeyPress) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(keyUp(keyPress));
    };
};

export const keyDown = (keyPress: KeyPress): AppActions => ({
    type: KEY_DOWN,
    keyPress,
});

export const KeyDown = (keyPress: KeyPress) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(keyDown(keyPress));
    };
};
