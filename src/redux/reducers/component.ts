import { Component } from "../types/actions";
import {
    ComponentActionTypes,
    SET_COMPONENTS,
    DELETE_COMPONENT,
    ADD_COMPONENT,
    EDIT_COMPONENT,
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
        // console.log(child);
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
            console.log("exit at: " + i);
            console.log("input arr length: " + layersArray.length);
            console.log("output arr length: " + newArray.length);
            return newArray;
        }
        let current = i;
        if (!newArray.includes(layersArray[i]) && !layersArray.parent) {
            newArray.push(layersArray[i]);
            newArray.concat(runDownNestedLayers(current, layersArray, newArray, hasMoreChildren));
        } else {
            if (newArray.length === layersArray.length) {
                // console.log("Arrays before ending");
                // console.log(newArray);
                // console.log(layersArray);
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
        // console.log(selectedComponents[0]);
        let newComponentObj = components[components.length - 1];
        // console.log(components);
        newComponentArr = components.map((obj) => {
            // console.log(obj);
            // console.log(parentLayer);
            if (obj.id === parentLayer.id) {
                if (parentLayer.children === null) {
                    let newChild = [newComponentObj.id];
                    // console.log(newChild);
                    return { ...obj, children: newChild };
                } else {
                    let newChildren = parentLayer.children.map((el) => {
                        return el;
                    });
                    newChildren.push(newComponentObj.id);
                    // console.log(newChildren);
                    return { ...obj, children: newChildren };
                }
            }
            // console.log(obj);
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
        console.log("idx doesnt exist");
        return;
    }

    let parentIdx = newLayers.findIndex((layer) => layer.id == parent);
    if (newLayers.length == 1 || idx === 0) {
        // newLayers = [];
        console.log(newLayers);
    }
    if (parent !== null) {
        let childIdx = newLayers[parentIdx].children.indexOf(id);
        console.log(childIdx);
        console.log(newLayers);
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
                console.log(i);
                console.log(idx);
                numChildren = i - idx - 1;
                childrenFound = true;
                console.log("children found");
            }
        }
        newLayers.splice(idx + 1, numChildren);
        console.log(numChildren);
        console.log(newLayers);
    }

    newLayers.splice(idx, 1);
    console.log(newLayers);
    return newLayers;
};

const componentReducer = (state = componentsReducerDefaultState, action: ComponentActionTypes) => {
    switch (action.type) {
        case ADD_COMPONENT:
            let newComponents = [...state, action.component];
            newComponents = addComponent(newComponents);
            return buildLayerOrder(newComponents);
        case EDIT_COMPONENT:
            return state.map((component) => {
                if (component.id === action.component.id) {
                    return { ...component, ...action.component };
                }
                return component;
            });
        case DELETE_COMPONENT:
            return deleteComponent(action.component, state);
        case SET_COMPONENTS:
            return buildLayerOrder(action.components);
        default:
            return state;
    }
};

export { componentReducer };
