// import uuid from "uuid";
import { Components } from "../types/actions";
import {
  // ADD_EXPENSE,
  AppActions,
  // REMOVE_EXPENSE,
  // EDIT_COMPONENTS,
  SET_COMPONENTS
} from "../types/actions";
import { Dispatch } from "redux";
import { AppState } from "../store/storeConfiguration";

// export const addExpense = (expense: Expense): AppActions => ({
//   type: ADD_EXPENSE,
//   expense
// });

// export const removeExpense = (id: string): AppActions => ({
//   type: REMOVE_EXPENSE,
//   id
// });

// export const editComponents = (component: Components): AppActions => ({
//   type: EDIT_COMPONENTS,
//   component
// });

export const setComponents = (components: Components[]): AppActions => ({
  type: SET_COMPONENTS,
  components
});

// export const startAddExpense = (expenseData: {
//   description?: string;
//   note?: string;
//   amount?: number;
//   createdAt?: number;
// }) => {
//   return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
//     const {
//       description = "",
//       note = "",
//       amount = 0,
//       createdAt = 0
//     } = expenseData;
//     const expense = { description, note, amount, createdAt };

//     const id = uuid();

//     return dispatch(
//       addExpense({
//         id,
//         ...expense
//       })
//     );
//   };
// };

// export const startRemoveExpense = (id: string) => {
//   return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
//     dispatch(removeExpense(id));
//   };
// };

// export const startEditExpense = (components: Components) => {
//   return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
//     dispatch(editComponents(components));
//   };
// };

export const startSetComponents = (components: Components[]) => {
  return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    dispatch(setComponents(components));
  };
};
