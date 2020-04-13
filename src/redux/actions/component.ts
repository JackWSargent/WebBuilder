import { Component } from "../types/actions";
import { AppActions, SET_COMPONENT } from "../types/actions";
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

// export const editComponent = (component: Component): AppActions => ({
//   type: EDIT_COMPONENT,
//   component
// });

export const setComponent = (component: Component[]): AppActions => ({
    type: SET_COMPONENT,
    component,
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

// export const startEditExpense = (component: Component) => {
//   return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
//     dispatch(editComponent(component));
//   };
// };

export const SetComponent = (component: Component[]) => {
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
        dispatch(setComponent(component));
    };
};
