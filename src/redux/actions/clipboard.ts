import { AppActions, CopiedComponent, COPY_COMPONENT } from "../types/actions";
import { Dispatch } from "redux";
import { AppState } from "../store/storeConfiguration";

export function CopyComponent(copiedComponent: CopiedComponent) {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch({
            type: COPY_COMPONENT,
            copiedComponent,
        });
    };
}
