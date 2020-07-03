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

const historyReducer = (state = historyReducerDefaultState, action: HistoryActionTypes) => {
    switch (action.type) {
        case ADD_HISTORY:
            if (!canDispatch) {
                return state;
            }
            let newUndoArr = [];
            let undoRef = action.history.undo;
            //Component Array (Selection of Components Undo)
            if (undoRef.length > 1 && undoRef[0].id) {
                newUndoArr = state.undo.concat({ comp: undoRef });
            }
            //Single Component Modification
            else if (
                state.undo[state.undo.length - 1] !== action.history.undo[action.history.undo.length - 1] &&
                action.history.undo[0].id
            ) {
                newUndoArr = state.undo.concat(...action.history.undo);
            }
            let newRedoArr: Redo[] = [];
            return {
                undo: newUndoArr,
                redo: newRedoArr,
            };
        case UNDO_HISTORY:
            if (!canDispatch || state.undo.length < 1) {
                return state;
            }
            let undoArr = state.undo.map((el) => {
                return el;
            });
            let redoArr = state.redo.map((el) => {
                return el;
            });
            redoArr.push(action.redo);
            // redoArr.push(undoArr[undoArr.length - 1]);
            undoArr.splice(undoArr.length - 1, 1);
            canDispatch = false;
            return {
                undo: undoArr,
                redo: redoArr,
            };
        case REDO_HISTORY:
            if (!canDispatch || state.redo.length < 1) {
                // console.log("Cannot dispatch inside redo");
                canDispatch = false;
                return state;
            }
            let newUndoArray = state.undo.map((el) => {
                return el;
            });
            let newRedoArray = state.redo.map((el) => {
                return el;
            });
            newUndoArray.push(newRedoArray[newRedoArray.length - 1]);
            newRedoArray.splice(newRedoArray.length - 1, 1);
            canDispatch = false;
            return {
                undo: newUndoArray,
                redo: newRedoArray,
            };
        case ENABLE_DISPATCH:
            canDispatch = true;
            return state;
        default:
            return state;
    }
};

export { historyReducer };
