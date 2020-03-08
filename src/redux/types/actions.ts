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
// action strings
// export const ADD_EXPENSE = "ADD_EXPENSE";
// export const EDIT_COMPONENTS = "EDIT_COMPONENTS";
// export const REMOVE_EXPENSE = "REMOVE_EXPENSE";
export const SET_COMPONENTS = "SET_COMPONENTS";

export interface SetComponentsAction {
  type: typeof SET_COMPONENTS;
  components: Components[];
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
// | EditComponentsAction;
// | RemoveExpenseAction
// | AddExpenseAction;

export type AppActions = ComponentsActionTypes;
