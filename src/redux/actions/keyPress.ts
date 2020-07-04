import { AppActions, KeyPress, KEY_DOWN, KEY_UP } from "../types/actions";
import { Dispatch } from "redux";
import { AppState } from "../store/storeConfiguration";

export function KeyUp(keyPress: KeyPress) {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch({
            type: KEY_UP,
            keyPress,
        });
    };
}

export function KeyDown(keyPress: KeyPress) {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch({
            type: KEY_DOWN,
            keyPress,
        });
    };
}
