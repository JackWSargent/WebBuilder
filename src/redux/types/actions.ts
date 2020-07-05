export const SET_COMPONENTS = "SET_COMPONENTS";
export const EDIT_COMPONENT = "EDIT_COMPONENT";
export const EDIT_COMPONENTS = "EDIT_COMPONENTS";
export const DELETE_COMPONENT = "DELETE_COMPONENT";
export const ADD_COMPONENT = "ADD_COMPONENT";

export const SET_CANVAS_STYLING = "SET_CANVAS_STYLING";

export const COPY_COMPONENT = "COPY_COMPONENT";
export const PASTE_COMPONENT = "PASTE_COMPONENT";
export const UNDO_COMPONENT = "UNDO_COMPONENT";
export const UNDO_COMPONENTS = "UNDO_COMPONENTS";
export const UNDO_DELETE_COMPONENTS = "UNDO_DELETE_COMPONENTS";
export const REDO_COMPONENT = "REDO_COMPONENT";

export const SET_CANVAS = "SET_CANVAS";
export const EDIT_CANVAS = "EDIT_CANVAS";

export const ADD_HISTORY = "ADD_HISTORY";
export const UNDO_HISTORY = "UNDO_HISTORY";
export const REDO_HISTORY = "REDO_HISTORY";
export const ENABLE_DISPATCH = "ENABLE_DISPATCH";

export const KEY_DOWN = "KEY_DOWN";
export const KEY_UP = "KEY_UP";

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
    drawerLeftMargin?: number; // Originally was going to be able to adjust margin
    drawerClicked?: boolean;
}

export interface History {
    undo?: Undo[];
    redo?: Redo[];
}

export interface Undo {
    component?: Component;
    components?: Component[];
    newLayers?: Component[];
    canvas?: Canvas;
    id?: number;
    boxSizing?: string;
    fontSize?: number;
    type?: string;
    innerText?: string;
    comp?: Object;
}

export interface Redo {
    component?: Component;
    components?: Component[];
    canvas?: Canvas;
    id?: number;
    boxSizing?: string;
    fontSize?: number;
    type?: string;
    innerText?: string;
}

export interface KeyPress {}

// COMPONENTS

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

export interface UndoComponentAction {
    type: typeof UNDO_COMPONENT;
    undo: Undo[];
    history: History;
}

export interface UndoComponentsAction {
    type: typeof UNDO_COMPONENTS;
    undo: Undo[];
    history: History;
}

export interface UndoDeleteComponentsAction {
    type: typeof UNDO_DELETE_COMPONENTS;
    undo: Undo[];
    history: History;
}

export interface RedoComponentAction {
    type: typeof REDO_COMPONENT;
    redo: Redo[];
    history: History;
}

// CANVAS STYLING

export interface SetCanvasStylingAction {
    type: typeof SET_CANVAS_STYLING;
    canvasStyling: CanvasStyling;
}

// CANVAS

export interface SetCanvasAction {
    type: typeof SET_CANVAS;
    canvas: Canvas;
}

export interface EditCanvasAction {
    type: typeof EDIT_CANVAS;
    canvas: Canvas;
}

// HISTORY

export interface AddHistoryAction {
    type: typeof ADD_HISTORY;
    history: History;
    components?: Component[];
}

export interface UndoHistoryAction {
    type: typeof UNDO_HISTORY;
    redo: Redo;
}

export interface RedoHistoryAction {
    type: typeof REDO_HISTORY;
    undo: Undo;
}

export interface EnableDispatchHistoryAction {
    type: typeof ENABLE_DISPATCH;
}

// KEY PRESS

export interface KeyDownAction {
    type: typeof KEY_DOWN;
    keyPress: KeyPress;
}

export interface KeyUpAction {
    type: typeof KEY_UP;
    keyPress: KeyPress;
}

export type ComponentActionTypes =
    | SetComponentAction
    | DeleteComponentAction
    | AddComponentAction
    | EditComponentAction
    | EditComponentsAction
    | PasteComponentAction
    | UndoComponentAction
    | UndoComponentsAction
    | UndoDeleteComponentsAction
    | RedoComponentAction;

export type ClipboardActionTypes = CopyComponentAction;

export type CanvasStylingActionTypes = SetCanvasStylingAction;

export type CanvasActionTypes = SetCanvasAction | EditCanvasAction;

export type HistoryActionTypes = AddHistoryAction | UndoHistoryAction | RedoHistoryAction | EnableDispatchHistoryAction;

export type KeyPressActionTypes = KeyDownAction | KeyUpAction;

export type AppActions =
    | ClipboardActionTypes
    | ComponentActionTypes
    | CanvasStylingActionTypes
    | CanvasActionTypes
    | HistoryActionTypes
    | KeyPressActionTypes;
