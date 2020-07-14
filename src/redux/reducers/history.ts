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

const IsComponent = (state, undoRedoRef): boolean => {
    return state.undo[state.undo.length - 1] !== undoRedoRef[undoRedoRef.length - 1] && undoRedoRef[0].id;
};

const IsComponentArray = (undoRef): boolean => {
    return undoRef.length > 1 && undoRef[0].id;
};

const IsCanvasStyling = (undoRef): boolean => {
    if (!undoRef[0]) {
        return undoRef;
    }
    return undoRef[0].fontSizing || undoRef[0].boxSizing;
};

const AddHistory = (lastUndo, state): History => {
    if (!canDispatch) {
        return state;
    }
    let newUndoArr = [];
    let undoRef = lastUndo.slice();
    if (IsComponentArray(undoRef)) {
        newUndoArr = state.undo.concat({ comp: undoRef });
    } else if (IsComponent(state, undoRef)) {
        newUndoArr = state.undo.concat(...undoRef);
    } else if (IsCanvasStyling(undoRef)) {
        newUndoArr = state.undo.concat({ ...undoRef[0] });
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
    let redoRef = redo;
    let undoArr = state.undo;
    let redoArr = [];
    if (IsComponentArray(redoRef)) {
        redoArr = state.redo.concat({ comp: redoRef });
    } else if (IsComponent(state, [redoRef])) {
        redoArr = state.redo.concat(redoRef);
    } else if (IsCanvasStyling(redoRef)) {
        redoArr = state.redo.concat(redoRef);
    } else {
        redoArr = state.redo;
    }
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
    let undoRef = undo;
    let newUndoArray = [];
    let newRedoArray = state.redo;
    if (IsComponentArray(undoRef)) {
        newUndoArray = state.undo.concat({ comp: undoRef });
    } else if (IsComponent(state, [undoRef])) {
        newUndoArray = state.undo.concat(undoRef);
    } else if (IsCanvasStyling(undoRef)) {
        newUndoArray = state.undo.concat({ ...undoRef[0] });
    } else {
        newUndoArray = state.undo;
    }
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
