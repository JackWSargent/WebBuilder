import { History, ADD_HISTORY, HistoryActionTypes, Undo, Redo, UNDO_HISTORY, REDO_HISTORY } from "../types/actions";

export let historyReducerDefaultState: History = {
    undo: [],
    redo: [],
};

const historyReducer = (state = historyReducerDefaultState, action: HistoryActionTypes) => {
    switch (action.type) {
        case ADD_HISTORY:
            let newUndoArr: Undo[] = state.undo.concat(...action.history.undo);
            let newRedoArr: Redo[] = [];
            return { undo: newUndoArr, redo: newRedoArr };
        case UNDO_HISTORY:
            return state;
        case REDO_HISTORY:
            return state;
        default:
            return state;
    }
};

export { historyReducer };
