import { History, ADD_HISTORY, HistoryActionTypes } from "../types/actions";

export let historyReducerDefaultState: History = {
    undo: [],
    redo: [],
};

const historyReducer = (state = historyReducerDefaultState, action: HistoryActionTypes) => {
    switch (action.type) {
        case ADD_HISTORY:
            let newUndoArr = state.undo.push(...action.history.undo);
            let newRedoArr = [];
            return { newUndoArr, newRedoArr };
        default:
            return state;
    }
};

export { historyReducer };
