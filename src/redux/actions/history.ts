import { AppActions, History, ADD_HISTORY } from "../types/actions";
import { Dispatch } from "redux";
import { AppState } from "../store/storeConfiguration";

export const addHistory = (history: History): AppActions => ({
    type: ADD_HISTORY,
    history,
});

export const AddHistory = (history: History) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(addHistory(history));
    };
};
