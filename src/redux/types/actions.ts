export const SET_COMPONENTS = "SET_COMPONENTS";
export const EDIT_COMPONENT = "EDIT_COMPONENT";
export const EDIT_COMPONENTS = "EDIT_COMPONENTS";
export const DELETE_COMPONENT = "DELETE_COMPONENT";
export const ADD_COMPONENT = "ADD_COMPONENT";

export const SET_CANVAS_STYLING = "SET_CANVAS_STYLING";

export const COPY_COMPONENT = "COPY_COMPONENT";
export const PASTE_COMPONENT = "PASTE_COMPONENT";

export const SET_CANVAS = "SET_CANVAS";
export const EDIT_CANVAS = "EDIT_CANVAS";

export const ADD_HISTORY = "ADD_HISTORY";

export interface Component {
    isRendered?: boolean;
    id?: number;
    name?: string;
    type?: string;
    nestedLevel?: number;
    parent?: number;
    children?: number[];
    selected?: boolean;
    innerText?: string;
}

export interface CopiedComponent {
    name?: string;
    type?: string;
    innerText?: string;
}

export interface CanvasStyling {
    fontSize?: number;
    boxSizing?: string;
}

export interface Canvas {
    drawerOpen?: boolean;
    drawerLeftMargin?: number;
    drawerClicked?: boolean;
}

export interface History {
    undo?: Undo[];
    redo?: Redo[];
}

export interface Undo {
    components?: Component[];
    canvasStyling?: CanvasStyling;
    canvas?: Canvas;
}

export interface Redo {
    components?: Component[];
    canvasStyling?: CanvasStyling;
    canvas?: Canvas;
}

export interface SetComponentAction {
    type: typeof SET_COMPONENTS;
    components: Component[];
}

export interface DeleteComponentAction {
    type: typeof DELETE_COMPONENT;
    component: Component;
}

export interface AddComponentAction {
    type: typeof ADD_COMPONENT;
    component: Component;
}

export interface EditComponentAction {
    type: typeof EDIT_COMPONENT;
    component: Component;
}

export interface EditComponentsAction {
    type: typeof EDIT_COMPONENTS;
    components: Component[];
}

export interface CopyComponentAction {
    type: typeof COPY_COMPONENT;
    copiedComponent: CopiedComponent;
}

export interface PasteComponentAction {
    type: typeof PASTE_COMPONENT;
    id: number;
}

export interface SetCanvasStylingAction {
    type: typeof SET_CANVAS_STYLING;
    canvasStyling: CanvasStyling;
}

export interface SetCanvasAction {
    type: typeof SET_CANVAS;
    canvas: Canvas;
}

export interface EditCanvasAction {
    type: typeof EDIT_CANVAS;
    canvas: Canvas;
}

export interface AddHistoryAction {
    type: typeof ADD_HISTORY;
    history: History;
}

export type ComponentActionTypes =
    | SetComponentAction
    | DeleteComponentAction
    | AddComponentAction
    | EditComponentAction
    | EditComponentsAction
    | PasteComponentAction;

export type ClipboardActionTypes = CopyComponentAction;

export type CanvasStylingActionTypes = SetCanvasStylingAction;

export type CanvasActionTypes = SetCanvasAction | EditCanvasAction;

export type HistoryActionTypes = AddHistoryAction;

export type AppActions =
    | ClipboardActionTypes
    | ComponentActionTypes
    | CanvasStylingActionTypes
    | CanvasActionTypes
    | HistoryActionTypes;
