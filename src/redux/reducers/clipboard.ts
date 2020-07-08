import { CopiedComponent, COPY_COMPONENT, ClipboardActionTypes } from "../types/actions";

export let clipboardReducerDefaultState: CopiedComponent = {
    name: "",
    type: "",
    innerText: "",
};

const clipboardReducer = (state = clipboardReducerDefaultState, action: ClipboardActionTypes) => {
    let comp = action.copiedComponent;
    switch (action.type) {
        case COPY_COMPONENT: {
            return { ...state, ...comp };
        }
        default:
            return state;
    }
};

export { clipboardReducer };
