import { KeyPress, KEY_UP, KEY_DOWN, KeyPressActionTypes } from "../types/actions";

export let keyPressReducerDefaultState = [];

const keyPressReducer = (state = keyPressReducerDefaultState, action: KeyPressActionTypes) => {
    switch (action.type) {
        case KEY_DOWN:
            if (!state.indexOf(action.keyPress)) {
                state.push({ keyPressed: true });
            } else {
                state[`${action.keyPress}`] = true;
            }

            return state;
        case KEY_UP:
            state[`${action.keyPress}`] = false;
            return state;
        default:
            return state;
    }
};

export { keyPressReducer };
