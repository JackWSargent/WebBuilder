import {
    Component,
    AppActions,
    SET_COMPONENTS,
    DELETE_COMPONENT,
    ADD_COMPONENT,
    EDIT_COMPONENT,
    EDIT_COMPONENTS,
    PASTE_COMPONENT,
    UNDO_COMPONENT,
    UNDO_COMPONENTS,
    REDO_COMPONENT,
    UNDO_DELETE_COMPONENTS,
} from "../types/actions";

/* eslint-disable */

const componentsReducerDefaultState: Component[] = [
    {
        id: 100,
        isRendered: false,
        name: "Canvas",
        type: "canvas",
        selected: false,
        children: [200, 600],
        parent: null,
        nestedLevel: 0,
        innerText: "",
    },
    {
        id: 200,
        isRendered: false,
        name: "Item",
        type: "gridItem",
        selected: false,
        children: [300, 400, 500],
        parent: 100,
        nestedLevel: 1,
        innerText: "",
    },
    {
        id: 300,
        isRendered: false,
        name: "Item2",
        type: "gridItem",
        selected: false,
        children: null,
        parent: 200,
        nestedLevel: 2,
        innerText: "",
    },
    {
        id: 400,
        isRendered: false,
        name: "Item3",
        type: "gridItem",
        selected: false,
        children: null,
        parent: 200,
        nestedLevel: 2,
        innerText: "",
    },
    {
        id: 500,
        isRendered: false,
        name: "Container",
        type: "gridContainer",
        selected: false,
        children: null,
        parent: 200,
        nestedLevel: 2,
        innerText: "",
    },
    {
        id: 600,
        isRendered: false,
        name: "Container",
        type: "gridContainer",
        selected: false,
        children: null,
        parent: 100,
        nestedLevel: 1,
        innerText: "",
    },
];

let hasMoreChildren: boolean = false;

const componentHasChildren = (component) => {
    return component.children ? true : false;
};

const hasMultipleChildren = (component) => {
    return component.children.length > 1 ? true : false;
};

const getLengthOfChildren = (component) => {
    return component.children.length;
};

const getCurrentChild = (componentArray, currentNode, k) => {
    let compArr = componentArray.filter((component) => currentNode.children[k] === component.id);
    return compArr[0];
};

const getIndexOfCurrentComponent = (componentArray, currentChild) => {
    return componentArray.indexOf(currentChild);
};

const checkForSiblings = (currentComponentIndex: number, componentArray: Component[], newArray: Component[]) => {
    for (let i = newArray.length - 2; i > -1; i--) {
        let currentNode = newArray[i];
        if (componentHasChildren(currentNode)) {
            if (hasMultipleChildren(currentNode)) {
                for (let k = 1; k < getLengthOfChildren(currentNode); k++) {
                    let currentChild = getCurrentChild(componentArray, currentNode, k);
                    if (!newArray.includes(currentChild)) {
                        currentComponentIndex = getIndexOfCurrentComponent(componentArray, currentChild);
                        newArray.push(currentChild);
                        if (componentArray[currentComponentIndex].children) {
                            runDownNestedComponents(currentComponentIndex, componentArray, newArray);
                        }
                    }
                }
            }
        }
    }
};

const runDownNestedComponents = (
    currentComponentIndex: number,
    componentArray: Component[],
    newArray: Component[]
): Component[] => {
    if (componentArray[currentComponentIndex].children) {
        let newChild = componentArray.filter((comp) => componentArray[currentComponentIndex].children[0] === comp.id);
        let child = newChild[0];
        currentComponentIndex = componentArray.indexOf(child);
        newArray.push(child);
    }
    if (componentArray[currentComponentIndex].children === null && componentArray.length !== newArray.length) {
        hasMoreChildren = false;
        checkForSiblings(currentComponentIndex, componentArray, newArray);
    } else if (componentArray[currentComponentIndex].children === null && componentArray.length === newArray.length) {
        return newArray;
    } else {
        hasMoreChildren = true;
        runDownNestedComponents(currentComponentIndex, componentArray, newArray);
    }
};

export function BuildComponentOrder(componentArray) {
    let areMoreComponents = true;
    let newArray = [];
    for (let i = 0; areMoreComponents; i++) {
        if (!componentArray[i]) {
            areMoreComponents = false;
            return newArray;
        }
        let current = i;
        if (!newArray.includes(componentArray[i]) && !componentArray.parent) {
            newArray.push(componentArray[i]);
            newArray.concat(runDownNestedComponents(current, componentArray, newArray));
        } else {
            if (newArray.length === componentArray.length) {
                areMoreComponents = false;
                return newArray;
            }
        }
    }
    return newArray;
}

const addComponent = (components) => {
    let selectedComponents = [];
    let parentComponent = null;
    let newComponentArr = [];
    components.map((component) => {
        if (component.selected === true) {
            selectedComponents.push(component);
        }
    });
    if (selectedComponents.length === 1) {
        parentComponent = selectedComponents[0];
        let newComponentObj = components[components.length - 1];
        newComponentArr = components.map((obj) => {
            if (obj.id === parentComponent.id) {
                if (parentComponent.children === null) {
                    let newChild = [newComponentObj.id];
                    return { ...obj, children: newChild };
                } else {
                    let newChildren = parentComponent.children.map((el) => {
                        return el;
                    });
                    newChildren.push(newComponentObj.id);
                    return { ...obj, children: newChildren };
                }
            }
            return obj;
        });
    }

    return newComponentArr;
};

const GetParentIndex = (components, parent) => {
    return components.findIndex((comp) => comp.id === parent);
};

const GetChildIndex = (components, parentIndex, id) => {
    return components[parentIndex].children.indexOf(id);
};

const ComponentHasSingleChild = (components, parentIndex) => {
    return components[parentIndex].children.length == 1 ? true : false;
};

const SetParentChildrenToNull = (components, parentId) => {
    return components.map((comp) => {
        if (comp.id === parentId) {
            return {
                ...comp,
                children: null,
            };
        }
        return comp;
    });
};

const RemoveIdFromParent = (components, parentIndex, id, parentId) => {
    let childIndex = GetChildIndex(components, parentIndex, id);
    if (ComponentHasSingleChild(components, parentIndex)) {
        components = SetParentChildrenToNull(components, parentId);
    } else {
        components[parentIndex].children.splice(childIndex, 1);
    }
    return components;
};

const IsNextComponentNestedLevelEqualOrHigher = (components, component, nextIndex) => {
    return components[nextIndex].nestedLevel >= component.nestedLevel ? true : false;
};

const RemoveChildren = (components, parentIndex, component) => {
    let numChildren = 0;
    let childrenFound = false;
    for (let k = parentIndex + 1; k < components.length - 1 || !childrenFound; k++) {
        if (IsNextComponentNestedLevelEqualOrHigher(components, component, k)) {
            numChildren = k - parentIndex - 1;
            childrenFound = true;
        }
    }
    components.splice(parentIndex + 1, numChildren);
    return components;
};

const GetComponentIndex = (components, component) => {
    return components.findIndex((comp) => comp === component);
};

const DeleteComponent = (component, state) => {
    let id = component.id;
    let children = component.children;
    let parentId = component.parent;
    // console.log(state);
    let components = state;
    // console.log(components);
    let componentIndex = GetComponentIndex(components, component);
    let parentIndex = GetParentIndex(components, parentId);
    if (parentIndex < 0) {
        console.error("Parent Component does not exist");
        return;
    }
    if (components.length === 1) {
        console.warn("Canvas does not contain anything");
    }
    if (parent) {
        components = RemoveIdFromParent(components, parentIndex, id, parentId);
    }
    if (children) {
        components = RemoveChildren(components, parentIndex, component);
    }
    // console.log("Component Index" + componentIndex);
    components.splice(componentIndex, 1);
    // console.log(components);
    return components;
};

const UndoRedoComponent = (undo, components) => {
    let component = null;

    let newComponents = components.map((i) => {
        if (i.id === undo[undo.length - 1].id) {
            console.log("iteration id: ", i.id);
            component = i;

            return i;
        }
        return i;
    });
    if (!component) {
        return components;
    }

    let newComponent = undo[undo.length - 1];
    if (component) {
        let idx = newComponents.indexOf(component);
        newComponents.splice(idx, 1);
        newComponents.push(newComponent);
        return BuildComponentOrder(newComponents);
    }
    newComponents.push(component);
    return BuildComponentOrder(newComponents);
};

const PushParents = (oldComponents, state) => {
    let currentComponents = state.map((el) => el);
    oldComponents.map((el) => {
        if (!currentComponents.includes(el)) {
            console.log("doesnt include: " + el.id);
            console.log(oldComponents);
            let parentIdx = currentComponents.findIndex((comp) => comp.id === el.parent);
            let oldIdx = oldComponents.findIndex((comp) => comp.id === el.parent);
            currentComponents[parentIdx].children = oldComponents[oldIdx].children;
            currentComponents.push(el);
        }
    });
    return BuildComponentOrder(currentComponents);
};

const componentReducer = (state = componentsReducerDefaultState, action: AppActions) => {
    switch (action.type) {
        case ADD_COMPONENT:
            let newComponents = addComponent([...state, action.component]);
            return BuildComponentOrder(newComponents);
        case EDIT_COMPONENT:
            return state.map((component) => {
                if (component.id === action.component.id) {
                    return { ...component, ...action.component };
                }
                return component;
            });
        case EDIT_COMPONENTS: {
            console.log(state);
            return BuildComponentOrder(
                state.map((component) => {
                    action.components.forEach((edit) => {
                        if (edit.id === component.id) {
                            return edit;
                        }
                    });
                    return component;
                })
            );
        }
        case PASTE_COMPONENT: {
            return state.map((component) => {
                let id = action.id;
                if (action.id === component.id) {
                    return {
                        ...component,
                        // ...store.getState().clipboard,
                    };
                }
                return component;
            });
        }
        case DELETE_COMPONENT:
            return DeleteComponent(action.component, state);
        case SET_COMPONENTS:
            return BuildComponentOrder(action.components);
        case UNDO_COMPONENT:
            return UndoRedoComponent(action.history.undo, state);
        case UNDO_COMPONENTS:
            let previousComponentArr = action.history.undo[action.history.undo.length - 1].comp;
            return previousComponentArr;
        case UNDO_DELETE_COMPONENTS:
            let previousComponents = [action.history.undo[action.history.undo.length - 1].comp];
            previousComponents.map((el) => el);
            console.log(previousComponents[0]);
            let newState = PushParents(previousComponents[0], state);
            return newState;
        case REDO_COMPONENT:
            return UndoRedoComponent(action.history.redo, state);
        default:
            return state;
    }
};

export { componentReducer };
