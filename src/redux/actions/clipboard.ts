import { AppActions, CopiedComponent, COPY_COMPONENT } from "../types/actions";
import { Dispatch } from "redux";
import { AppState } from "../store/storeConfiguration";

export const copyComponent = (copiedComponent: CopiedComponent): AppActions => ({
    type: COPY_COMPONENT,
    copiedComponent,
});

export const CopyComponent = (copiedComponent: CopiedComponent) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(copyComponent(copiedComponent));
    };
};
