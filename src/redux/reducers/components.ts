import { Components } from "../types/actions";
import { ComponentsActionTypes, SET_COMPONENTS } from "../types/actions";

const componentsReducerDefaultState: Components[] = [
    {
        id: 100,
        isRendered: false,
        name: "Container",
        type: "gridContainer",
        selected: false,
        active: true,
        children: [200],
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
        //Run backwards through the newArray and look at the parent starting from the bottom
        let currentNode = newArray[i];
        if (currentNode.children) {
            if (currentNode.children.length > 1) {
                //If children is greater than 1 meaning that there could be potentially more children to render start loop looking through to see if they are included inside the newArray already
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
            //
            newArray.push(layersArray[i]);
            newArray.concat(runDownNestedLayers(i, current, layersArray, newArray, hasMoreChildren));
        } else {
            if (newArray.length === layersArray.length) {
                areMoreComponents = false;
            }
        }
    }
    console.log(newArray);
    return newArray;
};

const componentsReducer = (state = componentsReducerDefaultState, action: ComponentsActionTypes): Components[] => {
    switch (action.type) {
        case SET_COMPONENTS:
            return action.components;
        default:
            return state;
    }
};

export { componentsReducer };
