import { Components } from "../types/actions";
import { ComponentsActionTypes, SET_COMPONENTS } from "../types/actions";

const componentsReducerDefaultState: Components[] = [
  {
    id: 100,
    name: "Container",
    type: "div",
    selected: false,
    active: true,
    children: [300, 800],
    parent: null,
    nestedLevel: 0,
    row: 0
  },
  {
    id: 200,
    name: "Container",
    type: "div",
    selected: false,
    active: true,
    children: [500, 600],
    parent: null,
    nestedLevel: 0,
    row: 1
  },
  {
    id: 300,
    name: "Container",
    type: "div",
    selected: false,
    active: true,
    children: [400],
    parent: 100,
    nestedLevel: 1,
    row: 0
  },
  {
    id: 400,
    name: "Container",
    type: "div",
    selected: false,
    active: true,
    children: null,
    parent: 300,
    nestedLevel: 2,
    row: 0
  },
  {
    id: 500,
    name: "Container",
    type: "div",
    selected: false,
    active: true,
    children: null,
    parent: 200,
    nestedLevel: 1,
    row: 1
  },
  {
    id: 600,
    name: "Container",
    type: "div",
    selected: false,
    active: true,
    children: [700],
    parent: 200,
    nestedLevel: 1,
    row: 1
  },
  {
    id: 700,
    name: "Container",
    type: "div",
    selected: false,
    active: true,
    children: [900],
    parent: 600,
    nestedLevel: 2,
    row: 1
  },
  {
    id: 800,
    name: "Container",
    type: "div",
    selected: false,
    active: true,
    children: null,
    parent: 100,
    nestedLevel: 1,
    row: 0
  },
  {
    id: 900,
    name: "Container",
    type: "div",
    selected: false,
    active: true,
    children: null,
    parent: 700,
    nestedLevel: 3,
    row: 1
  }
];

const componentsReducer = (
  state = componentsReducerDefaultState,
  action: ComponentsActionTypes
): Components[] => {
  switch (action.type) {
    // case ADD_EXPENSE:
    //   return [...state, action.expense];
    // case REMOVE_EXPENSE:
    //   return state.filter(({ id }) => id !== action.id);
    // case EDIT_COMPONENTS:
    //   return state.map(components => {
    //     if (components.id === action.component.id) {
    //       return {
    //         ...components,
    //         ...action.component
    //       };
    //     } else {
    //       return components;
    //     }
    //   });
    case SET_COMPONENTS:
      return action.components;
    default:
      return state;
  }
};

export { componentsReducer };
