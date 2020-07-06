import {
    Component,
    // ComponentActionTypes,
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
import { store } from "../store/storeConfiguration";

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

export function buildLayerOrder(layersArray) {
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

    let newLayers = state.slice();

    let idx = newLayers.findIndex((comp) => comp.id == id);
    if (idx < 0) {
        console.error("Index doesnt exist for deletion");
        return;
    }

    let parentIdx = newLayers.findIndex((comp) => comp.id == parent);
    if (newLayers.length === 1 || idx === 0) {
        console.error("Components do not contain anything, GET SOME: " + newLayers);
    }
    if (parent !== null) {
        let childIdx = newLayers[parentIdx].children.indexOf(id);
        if (newLayers[parentIdx].children.length == 1) {
            newLayers = newLayers.map((comp) => {
                if (comp.id === parent) {
                    return {
                        ...comp,
                        children: null,
                    };
                }
                return comp;
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
    console.log(newLayers);
    return newLayers;
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
        return buildLayerOrder(newComponents);
    }
    newComponents.push(component);
    return buildLayerOrder(newComponents);
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
    return buildLayerOrder(currentComponents);
};

const componentReducer = (state = componentsReducerDefaultState, action: AppActions) => {
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
                        // ...store.getState().clipboard,
                    };
                }
                return component;
            });
        }
        case DELETE_COMPONENT:
            console.log(state);
            return deleteComponent(action.component, state);
        case SET_COMPONENTS:
            return buildLayerOrder(action.components);
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
