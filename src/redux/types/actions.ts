export interface Components {
  id: number;
  name: string;
  type: string;
  row: number;
  active: boolean;
  nestedLevel: number;
  parent?: number;
  children?: number[];
  selected: boolean;
}

export interface CanvasStyling {
  fontSize?: number;
  boxSizing?: string;
}

export interface Canvas {
  drawerOpen?: boolean;
  drawerLeftMargin?: number;
}

export const SET_COMPONENTS = "SET_COMPONENTS";
export const SET_CANVAS_STYLING = "SET_CANVAS_STYLING";
export const SET_CANVAS = "SET_CANVAS";

export interface SetComponentsAction {
  type: typeof SET_COMPONENTS;
  components: Components[];
}

export interface SetCanvasStylingAction {
  type: typeof SET_CANVAS_STYLING;
  canvasStyling: CanvasStyling[];
}

export interface SetCanvasAction {
  type: typeof SET_CANVAS;
  canvas: Canvas[];
}

// export interface EditComponentsAction {
//   type: typeof EDIT_COMPONENTS;
//   component: Components;
// }

// export interface RemoveExpenseAction {
//   type: typeof REMOVE_EXPENSE;
//   id: string;
// }

// export interface AddExpenseAction {
//   type: typeof ADD_EXPENSE;
//   expense: Expense;
// }

export type ComponentsActionTypes = SetComponentsAction;
export type CanvasStylingActionTypes = SetCanvasStylingAction;
export type CanvasActionTypes = SetCanvasAction;
export type AppActions =
  | ComponentsActionTypes
  | CanvasStylingActionTypes
  | CanvasActionTypes;
