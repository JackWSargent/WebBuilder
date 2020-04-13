export interface Component {
    isRendered?: boolean;
    id: number;
    name: string;
    type: string;
    row: number;
    active: boolean;
    nestedLevel: number;
    parent?: number;
    children?: number[];
    selected: boolean;
    content?: string;
}

export interface CanvasStyling {
    fontSize?: number;
    boxSizing?: string;
}

export interface Canvas {
    drawerOpen?: boolean;
    drawerLeftMargin?: number;
    drawerClicked?: boolean;
    idxIgnore?: Array<number>;
}

export const SET_COMPONENT = "SET_COMPONENT";
export const SET_CANVAS_STYLING = "SET_CANVAS_STYLING";
export const SET_CANVAS = "SET_CANVAS";

export interface SetComponentAction {
    type: typeof SET_COMPONENT;
    component: Component[];
}

export interface SetCanvasStylingAction {
    type: typeof SET_CANVAS_STYLING;
    canvasStyling: CanvasStyling[];
}

export interface SetCanvasAction {
    type: typeof SET_CANVAS;
    canvas: Canvas[];
}

export type ComponentActionTypes = SetComponentAction;
export type CanvasStylingActionTypes = SetCanvasStylingAction;
export type CanvasActionTypes = SetCanvasAction;
export type AppActions = ComponentActionTypes | CanvasStylingActionTypes | CanvasActionTypes;

// export interface EditComponentAction {
//   type: typeof EDIT_COMPONENT;
//   component: Component;
// }

// export interface RemoveExpenseAction {
//   type: typeof REMOVE_EXPENSE;
//   id: string;
// }

// export interface AddExpenseAction {
//   type: typeof ADD_EXPENSE;
//   expense: Expense;
// }
