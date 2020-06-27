import {
    Component,
    ComponentActionTypes,
    SET_COMPONENTS,
    DELETE_COMPONENT,
    ADD_COMPONENT,
    EDIT_COMPONENT,
    EDIT_COMPONENTS,
    PASTE_COMPONENT,
    UNDO_COMPONENT,
    REDO_COMPONENT,
} from "../types/actions";
import { clipboardReducerDefaultState } from "./clipboard";
import { historyReducerDefaultState } from "./history";

/* eslint-disable */

export const componentsReducerDefaultState: Component[] = [
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

const checkForSiblings = (
    currentLayerIndex: number,
    layersArray: Array<any>,
    newArray: Array<any>,
    hasMoreChildren: boolean
) => {
    for (let i = newArray.length - 2; i > -1; i--) {
        let currentNode = newArray[i];
        if (currentNode.children) {
            if (currentNode.children.length > 1) {
                for (let k = 1; k < currentNode.children.length; k++) {
                    let currentChild = layersArray.filter((layer) => currentNode.children[k] === layer.id);
                    currentChild = currentChild[0];
                    if (!newArray.includes(currentChild)) {
                        currentLayerIndex = layersArray.indexOf(currentChild);
                        newArray.push(currentChild);
                        if (layersArray[currentLayerIndex].children) {
                            runDownNestedLayers(currentLayerIndex, layersArray, newArray, hasMoreChildren);
                        }
                    }
                }
            }
        }
    }
};

const runDownNestedLayers = (
    currentLayerIndex: number,
    layersArray: Array<any>,
    newArray: Array<any>,
    hasMoreChildren: boolean
): Array<any> => {
    if (layersArray[currentLayerIndex].children) {
        let child = layersArray.filter((layer) => layersArray[currentLayerIndex].children[0] === layer.id);
        child = child[0];
        currentLayerIndex = layersArray.indexOf(child);
        newArray.push(child);
    }
    if (layersArray[currentLayerIndex].children === null && layersArray.length !== newArray.length) {
        hasMoreChildren = false;
        checkForSiblings(currentLayerIndex, layersArray, newArray, hasMoreChildren);
    } else if (layersArray[currentLayerIndex].children === null && layersArray.length === newArray.length) {
        return newArray;
    } else {
        hasMoreChildren = true;
        runDownNestedLayers(currentLayerIndex, layersArray, newArray, hasMoreChildren);
    }
};

function buildLayerOrder(layersArray) {
    let areMoreComponents = true;
    let newArray = [];
    for (let i = 0; areMoreComponents; i++) {
        if (!layersArray[i]) {
            areMoreComponents = false;
            return newArray;
        }
        let current = i;
        if (!newArray.includes(layersArray[i]) && !layersArray.parent) {
            newArray.push(layersArray[i]);
            newArray.concat(runDownNestedLayers(current, layersArray, newArray, hasMoreChildren));
        } else {
            if (newArray.length === layersArray.length) {
                areMoreComponents = false;
                return newArray;
            }
        }
    }
    return newArray;
}

const addComponent = (components) => {
    let selectedComponents = [];
    let parentLayer = null;
    let newComponentArr = [];
    components.map((layer) => {
        if (layer.selected === true) {
            selectedComponents.push(layer);
        }
    });
    if (selectedComponents.length === 1) {
        parentLayer = selectedComponents[0];
        let newComponentObj = components[components.length - 1];
        newComponentArr = components.map((obj) => {
            if (obj.id === parentLayer.id) {
                if (parentLayer.children === null) {
                    let newChild = [newComponentObj.id];
                    return { ...obj, children: newChild };
                } else {
                    let newChildren = parentLayer.children.map((el) => {
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

const deleteComponent = (component, state) => {
    let id = component.id;
    let children = component.children;
    let parent = component.parent;

    let newLayers = state.map((layer) => {
        return layer;
    });

    let idx = newLayers.findIndex((layer) => layer.id == id);
    if (idx < 0) {
        console.error("Index doesnt exist for deletion");
        return;
    }

    let parentIdx = newLayers.findIndex((layer) => layer.id == parent);
    if (newLayers.length == 1 || idx === 0) {
        console.error("Components do not contain anything, GET SOME: " + newLayers);
    }
    if (parent !== null) {
        let childIdx = newLayers[parentIdx].children.indexOf(id);
        if (newLayers[parentIdx].children.length == 1) {
            newLayers = newLayers.map((layer) => {
                if (layer.id === parent) {
                    return {
                        ...layer,
                        children: null,
                    };
                }
                return layer;
            });
        } else {
            newLayers[parentIdx].children.splice(childIdx, 1);
        }
    }
    if (children !== null) {
        let numChildren = 0;
        let childrenFound = false;
        for (let i = idx + 1; i < newLayers.length - 1 || !childrenFound; i++) {
            if (newLayers[i].nestedLevel <= component.nestedLevel) {
                numChildren = i - idx - 1;
                childrenFound = true;
            }
        }
        newLayers.splice(idx + 1, numChildren);
    }

    newLayers.splice(idx, 1);
    return newLayers;
};

const UndoComponent = (components) => {
    let newComponents = components.map((i) => {
        return i;
    });
    console.log(historyReducerDefaultState);
    let component = historyReducerDefaultState.undo[historyReducerDefaultState.undo.length - 1];
    console.log(component, "Component");
    if (components.includes(component)) {
        // Inside the components array
        console.log("Included in array");
        let idx = components.find(component);
        newComponents.splice(idx, 1);
        newComponents.push(component);
        return buildLayerOrder(newComponents);
    }
    // Isn't inside the components array
    newComponents.push(component);
    console.log(newComponents);
    return buildLayerOrder(newComponents);
};

const RedoComponent = (components) => {
    let component = historyReducerDefaultState[historyReducerDefaultState.redo.length - 1];
    let newComponents = components.map((i) => {
        return i;
    });
    if (components.includes(component)) {
        // Inside the components array
        let idx = components.find(component);
        newComponents.splice(idx, 1);
        newComponents.push(component);
        return buildLayerOrder(newComponents);
    }
    // Isn't inside the components array
    newComponents.push(component);
    console.log(newComponents);
    return buildLayerOrder(newComponents);
};

const componentReducer = (state = componentsReducerDefaultState, action: ComponentActionTypes) => {
    switch (action.type) {
        case ADD_COMPONENT:
            let newComponents = addComponent([...state, action.component]);
            return buildLayerOrder(newComponents);
        case EDIT_COMPONENT:
            return state.map((component) => {
                if (component.id === action.component.id) {
                    return { ...component, ...action.component };
                }
                return component;
            });
        case EDIT_COMPONENTS: {
            return buildLayerOrder(
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
                        ...clipboardReducerDefaultState,
                    };
                }
                return component;
            });
        }
        case DELETE_COMPONENT:
            return deleteComponent(action.component, state);
        case SET_COMPONENTS:
            console.log(action.components);
            return buildLayerOrder(action.components);
        case UNDO_COMPONENT:
            return UndoComponent(state);
        case REDO_COMPONENT:
            return RedoComponent(state);
        default:
            return state;
    }
};

export { componentReducer };
