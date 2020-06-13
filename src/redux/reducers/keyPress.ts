import { KeyPress, KEY_UP, KEY_DOWN, KeyPressActionTypes } from "../types/actions";

export let keyPressReducerDefaultState = {};

const aliasKey = (key) => {
    const alias = {
        backspace: 8,
        tab: 9,
        enter: 13,
        shift: 16,
        ctrl: 17,
        alt: 18,
        pause: 19,
        capsLock: 20,
        escape: 27,
        space: 32,
        pageUp: 33,
        pageDown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        printScreen: 44,
        insert: 45,
        delete: 46,
        "0": 48,
        "1": 49,
        "2": 50,
        "3": 51,
        "4": 52,
        "5": 53,
        "6": 54,
        "7": 55,
        "8": 56,
        "9": 57,
        a: 65,
        b: 66,
        c: 67,
        d: 68,
        e: 69,
        f: 70,
        g: 71,
        h: 72,
        i: 73,
        j: 74,
        k: 75,
        l: 76,
        m: 77,
        n: 78,
        o: 79,
        p: 80,
        q: 81,
        r: 82,
        s: 83,
        t: 84,
        u: 85,
        v: 86,
        w: 87,
        x: 88,
        y: 89,
        z: 90,
        semiColon: 186,
        equal: 187,
        ",": 188,
        "-": 189,
    };

    return getKeyByValue(alias, key);
};

function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value)
        ? Object.keys(object).find((key) => object[key] === value)
        : value;
}

const keyPressReducer = (state = keyPressReducerDefaultState, action: KeyPressActionTypes) => {
    switch (action.type) {
        case KEY_DOWN:
            state[aliasKey(action.keyPress)] = true;
            // state[`${action.keyPress}`] = true;
            // if (!state.indexOf(action.keyPress)) {
            //     state.push({ keyPressed: true });
            // } else {
            //     state[`${action.keyPress}`] = true;
            // }

            return state;
        case KEY_UP:
            state[aliasKey(action.keyPress)] = false;
            return state;
        default:
            return state;
    }
};

export { keyPressReducer };
