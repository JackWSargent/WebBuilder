import { Component } from "../types/actions";
import { ComponentActionTypes, SET_COMPONENTS, DELETE_COMPONENT } from "../types/actions";

const componentsReducerDefaultState: Component[] = [
    {
        id: 100,
        isRendered: false,
        name: "Canvas",
        type: "canvas",
        selected: false,
        active: true,
        children: [200, 600],
        parent: null,
        nestedLevel: 0,
        row: 0,
    },
    {
        id: 200,
        isRendered: false,
        name: "Item",
        type: "gridItem",
        selected: false,
        active: true,
        children: [300, 400, 500],
        parent: 100,
        nestedLevel: 1,
        row: 0,
    },
    {
        id: 300,
        isRendered: false,
        name: "Item2",
        type: "gridItem",
        selected: false,
        active: true,
        children: null,
        parent: 200,
        nestedLevel: 2,
        row: 0,
    },
    {
        id: 400,
        isRendered: false,
        name: "Item3",
        type: "gridItem",
        selected: false,
        active: true,
        children: null,
        parent: 200,
        nestedLevel: 2,
        row: 0,
    },
    {
        id: 500,
        isRendered: false,
        name: "Container",
        type: "div",
        selected: false,
        active: true,
        children: null,
        parent: 200,
        nestedLevel: 2,
        row: 0,
    },
    {
        id: 600,
        isRendered: false,
        name: "Container",
        type: "div",
        selected: false,
        active: true,
        children: null,
        parent: 100,
        nestedLevel: 1,
        row: 0,
    },
];

let hasMoreChildren: boolean = false;

const checkForSiblings = (
    row: number,
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
                            runDownNestedLayers(row, currentLayerIndex, layersArray, newArray, hasMoreChildren);
                        }
                    }
                }
            }
        }
    }
};

const runDownNestedLayers = (
    row: number,
    currentLayerIndex: number,
    layersArray: Array<any>,
    newArray: Array<any>,
    hasMoreChildren: boolean
): Array<any> => {
    if (layersArray[currentLayerIndex].children && layersArray[currentLayerIndex].row === row) {
        let child = layersArray.filter((layer) => layersArray[currentLayerIndex].children[0] === layer.id);
        child = child[0];
        currentLayerIndex = layersArray.indexOf(child);
        newArray.push(child);
    }
    if (layersArray[currentLayerIndex].children === null && layersArray.length !== newArray.length) {
        hasMoreChildren = false;
        checkForSiblings(row, currentLayerIndex, layersArray, newArray, hasMoreChildren);
    } else if (layersArray[currentLayerIndex].children === null && layersArray.length === newArray.length) {
        return newArray;
    } else {
        hasMoreChildren = true;
        runDownNestedLayers(row, currentLayerIndex, layersArray, newArray, hasMoreChildren);
    }
};

const buildLayerOrder = (layersArray) => {
    let areMoreComponents = true;
    let newArray = [];
    for (let i = 0; areMoreComponents; i++) {
        if (!layersArray[i]) {
            areMoreComponents = false;
            return newArray;
        }
        let current = i;
        if (layersArray[i].row === i && !newArray.includes(layersArray[i]) && !layersArray.parent) {
            newArray.push(layersArray[i]);
            newArray.concat(runDownNestedLayers(i, current, layersArray, newArray, hasMoreChildren));
        } else {
            if (newArray.length === layersArray.length) {
                areMoreComponents = false;
            }
        }
    }
    return newArray;
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
        newLayers = [];
        console.log(newLayers);
    }
    //Delete parent reference to child
    if (parent !== null) {
        let childIdx = newLayers[parentIdx].children.indexOf(id);
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
        let numChildren = children.length;
        newLayers.splice(idx + 1, numChildren);
    }

    newLayers.splice(idx, 1);

    return newLayers;
};

const componentReducer = (state = componentsReducerDefaultState, action: ComponentActionTypes) => {
    switch (action.type) {
        case DELETE_COMPONENT:
            return deleteComponent(action.component, state);
        case SET_COMPONENTS:
            return buildLayerOrder(action.components);
        default:
            return state;
    }
};

export { componentReducer };
