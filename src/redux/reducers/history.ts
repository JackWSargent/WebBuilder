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
            let undoRef = action.history.undo.map((el) => el);
            let undoRef2 = undoRef.slice();
            // console.log(undoRef2);
            //Component Array (Selection of Components Undo)
            if (undoRef.length > 1 && undoRef[0].id) {
                newUndoArr = state.undo.concat({ comp: undoRef2 });
            }
            //Single Component Modification
            else if (state.undo[state.undo.length - 1] !== undoRef2[undoRef2.length - 1] && undoRef2[0].id) {
                newUndoArr = state.undo.concat(...undoRef2);
            }
            let newRedoArr: Redo[] = [];
            return {
                undo: newUndoArr,
                redo: newRedoArr,
            };
        case UNDO_HISTORY:
            if (!canDispatch || state.undo.length < 1) {
                canDispatch = false;
                return state;
            }
            let undoArr = state.undo.map((el) => {
                return el;
            });
            let redoArr = state.redo.map((el) => {
                return el;
            });
            redoArr.push(action.redo);
            undoArr.splice(undoArr.length - 1, 1);
            canDispatch = false;
            return {
                undo: undoArr,
                redo: redoArr,
            };
        case REDO_HISTORY:
            if (!canDispatch || state.redo.length < 1) {
                canDispatch = false;
                return state;
            }
            let newUndoArray = state.undo.map((el) => {
                return el;
            });
            let newRedoArray = state.redo.map((el) => {
                return el;
            });
            newUndoArray.push(action.undo);
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
