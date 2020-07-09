import {
    History,
    ADD_HISTORY,
    HistoryActionTypes,
    // Undo,
    Redo,
    UNDO_HISTORY,
    REDO_HISTORY,
    ENABLE_DISPATCH,
} from "../types/actions";

export let historyReducerDefaultState: History = {
    undo: [],
    redo: [],
};

export let canDispatch = true;

const IsComponent = (state, undoRef): boolean => {
    return state.undo[state.undo.length - 1] !== undoRef[undoRef.length - 1] && undoRef[0].id;
};

const IsComponentArray = (undoRef): boolean => {
    return undoRef.length > 1 && undoRef[0].id;
};

const AddHistory = (lastUndo, state): History => {
    if (!canDispatch) {
        return state;
    }
    let newUndoArr = [];
    let undoRef = lastUndo.slice();
    if (IsComponentArray(undoRef)) {
        newUndoArr = state.undo.concat({ comp: undoRef });
    }
    if (IsComponent(state, undoRef)) {
        newUndoArr = state.undo.concat(...undoRef);
    }
    let newRedoArr: Redo[] = [];
    return {
        undo: newUndoArr,
        redo: newRedoArr,
    };
};

const UndoHistory = (redo, state): History => {
    if (!canDispatch || state.undo.length < 1) {
        canDispatch = false;
        return state;
    }
    let undoArr = state.undo.slice();
    let redoArr = state.redo.slice();
    redoArr.push(redo);
    undoArr.splice(undoArr.length - 1, 1);
    canDispatch = false;
    return {
        undo: undoArr,
        redo: redoArr,
    };
};

const RedoHistory = (undo, state): History => {
    if (!canDispatch || state.redo.length < 1) {
        canDispatch = false;
        return state;
    }
    let newUndoArray = state.undo.slice();
    let newRedoArray = state.redo.slice();
    newUndoArray.push(undo);
    newRedoArray.splice(newRedoArray.length - 1, 1);
    canDispatch = false;
    return {
        undo: newUndoArray,
        redo: newRedoArray,
    };
};

const historyReducer = (state = historyReducerDefaultState, action: HistoryActionTypes) => {
    switch (action.type) {
        case ADD_HISTORY:
            return AddHistory(action.history.undo, state);
        case UNDO_HISTORY:
            return UndoHistory(action.redo, state);
        case REDO_HISTORY:
            return RedoHistory(action.undo, state);
        case ENABLE_DISPATCH:
            canDispatch = true;
            return state;
        default:
            return state;
    }
};

export { historyReducer };
