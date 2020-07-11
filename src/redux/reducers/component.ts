import {
    Component,
    Undo,
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
    CopiedComponent,
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
        sequenceNumber: null,
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
        sequenceNumber: 0,
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
        sequenceNumber: 0,
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
        sequenceNumber: 1,
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
        sequenceNumber: 2,
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
        sequenceNumber: 1,
    },
];

let hasMoreChildren: boolean = false;

const HasMultipleChildren = (component: Component): boolean => {
    return component.children.length > 1;
};

const GetLengthOfChildren = (component: Component): number => {
    return component.children.length;
};

const GetCurrentChild = (componentArray: Component[], currentNode: Component, k: number): Component => {
    let compArr: Component[] = componentArray.filter((component) => currentNode.children[k] === component.id);
    return compArr[0];
};

const GetIndexOfCurrentComponent = (componentArray: Component[], currentChild: Component): number => {
    return componentArray.indexOf(currentChild);
};

const HasChildren = (component: Component): boolean => {
    return component.children ? true : false;
};

const CheckForSiblings = (currentComponentIndex: number, componentArray: Component[], newArray: Component[]) => {
    for (let i = newArray.length - 2; i > -1; i--) {
        let currentNode: Component = newArray[i];
        if (HasChildren(currentNode) && HasMultipleChildren(currentNode)) {
            for (let k = 1; k < GetLengthOfChildren(currentNode); k++) {
                let currentChild = GetCurrentChild(componentArray, currentNode, k);
                if (!newArray.includes(currentChild)) {
                    currentComponentIndex = GetIndexOfCurrentComponent(componentArray, currentChild);
                    newArray.push(currentChild);
                    if (HasChildren(componentArray[currentComponentIndex])) {
                        RunDownNestedComponents(currentComponentIndex, componentArray, newArray);
                    }
                }
            }
        }
    }
};

const RunDownNestedComponents = (
    currentComponentIndex: number,
    componentArray: Component[],
    newArray: Component[]
): Component[] => {
    if (componentArray[currentComponentIndex].children) {
        let newChildArr: Component[] = componentArray.filter(
            (comp) => componentArray[currentComponentIndex].children[0] === comp.id
        );
        let child: Component = newChildArr[0];
        currentComponentIndex = componentArray.indexOf(child);
        newArray.push(child);
    }
    if (componentArray[currentComponentIndex].children === null && componentArray.length !== newArray.length) {
        hasMoreChildren = false;
        CheckForSiblings(currentComponentIndex, componentArray, newArray);
    } else if (componentArray[currentComponentIndex].children === null && componentArray.length === newArray.length) {
        return newArray;
    } else {
        hasMoreChildren = true;
        RunDownNestedComponents(currentComponentIndex, componentArray, newArray);
    }
};

const LengthsAreEqual = (arr1: Component[], arr2: Component[]): boolean => {
    return arr1.length === arr2.length;
};

export function BuildComponentOrder(componentArray: Component[]): Component[] {
    let areMoreComponents: boolean = true;
    let newArray: Component[] = [];
    for (let current = 0; areMoreComponents; current++) {
        if (!componentArray[current]) {
            areMoreComponents = false;
            return newArray;
        }
        if (!newArray.includes(componentArray[current]) && !componentArray[current].parent) {
            newArray.push(componentArray[current]);
            newArray.concat(RunDownNestedComponents(current, componentArray, newArray));
        } else {
            if (LengthsAreEqual(newArray, componentArray)) {
                areMoreComponents = false;
                return newArray;
            }
        }
    }
    return newArray;
}

const PushSelectedComponents = (components: Component[], selectedComponents: Component[]): Component[] => {
    components.map((component) => {
        if (component.selected === true) {
            selectedComponents.push(component);
        }
    });
    return selectedComponents;
};

const OnlyOneComponentSelected = (selectedComponents: Component[]): boolean => {
    return selectedComponents.length === 1;
};

const IsIdEqual = (obj1: Component, obj2: Component): boolean => {
    return obj1.id === obj2.id;
};

const DoesNotHaveChildren = (component: Component): boolean => {
    return component.children === null;
};

const PushToParentsChildren = (parentComponent: Component, componentId: number, component: Component): Component => {
    let newChildren = parentComponent.children.map((i) => i);
    newChildren.push(componentId);
    return { ...component, children: newChildren };
};

const AddComponentToArray = (
    selectedComponents: Component[],
    parentComponent: Component,
    newComponentArr: Component[],
    components: Component[]
): Component[] => {
    parentComponent = selectedComponents[0];
    let componentId: number = components[components.length - 1].id;
    newComponentArr = components.map((component) => {
        if (IsIdEqual(component, parentComponent)) {
            if (DoesNotHaveChildren(parentComponent)) {
                let newChild: number[] = [componentId];
                return { ...component, children: newChild };
            }
            return PushToParentsChildren(parentComponent, componentId, component);
        }
        return component;
    });
    return newComponentArr;
};

const ReturnOldComponents = (components): Component[] => {
    components.splice(components.length - 1, 1);
    return components;
};

const AddComponent = (components): Component[] => {
    let selectedComponents: Component[] = [];
    let parentComponent: Component = null;
    let newComponentArr: Component[] = [];
    selectedComponents = PushSelectedComponents(components, selectedComponents);
    if (OnlyOneComponentSelected(selectedComponents)) {
        return AddComponentToArray(selectedComponents, parentComponent, newComponentArr, components);
    }
    return ReturnOldComponents(components);
};

const GetParentIndex = (components: Component[], parent: number): number => {
    return components.findIndex((comp) => comp.id === parent);
};

const GetChildIndex = (components: Component[], parentIndex: number, id: number): number => {
    return components[parentIndex].children.indexOf(id);
};

const ComponentHasSingleChild = (components: Component[], parentIndex: number): boolean => {
    return components[parentIndex].children.length == 1;
};

const SetParentChildrenToNull = (components: Component[], parentId: number): Component[] => {
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

const RemoveIdFromParent = (
    components: Component[],
    parentIndex: number,
    id: number,
    parentId: number
): Component[] => {
    let childIndex: number = GetChildIndex(components, parentIndex, id);
    if (ComponentHasSingleChild(components, parentIndex)) {
        components = SetParentChildrenToNull(components, parentId);
    } else {
        components[parentIndex].children.splice(childIndex, 1);
    }
    return components;
};

const IsNextComponentNestedLevelEqualOrHigher = (
    components: Component[],
    component: Component,
    nextIndex: number
): boolean => {
    return components[nextIndex].nestedLevel >= component.nestedLevel;
};

const RemoveChildren = (components: Component[], parentIndex: number, component: Component): Component[] => {
    let numChildren: number = 0;
    let childrenFound: boolean = false;
    for (let k: number = parentIndex + 1; k < components.length - 1 || !childrenFound; k++) {
        if (IsNextComponentNestedLevelEqualOrHigher(components, component, k)) {
            numChildren = k - parentIndex - 1;
            childrenFound = true;
        }
    }
    components.splice(parentIndex + 1, numChildren);
    return components;
};

const GetComponentIndex = (components: Component[], component: Component): number => {
    return components.findIndex((comp) => comp === component);
};

const LengthIsOne = (arr: Array<any>): boolean => {
    return arr.length === 1;
};

const GetSiblings = (components: Component[], parentIndex: number): boolean => {
    return components[parentIndex].children.length > 1;
};

const IsLastChild = (components: Component[], parentIndex: number, id: number): boolean => {
    //At end of array inside parent children array
    if (components[parentIndex].children.indexOf(id) === components[parentIndex].children.length - 1) {
        return true;
    }
    return false;
};

const ChangeSequenceNumbers = (components: Component[], parentIndex: number, id: number): Component[] => {
    let newComponents = components.slice();
    //Reset the sequence numbers of the children that are left by looping through the
    //parent's children and then map through the components, match the id and change the sequence number to the index of the loop initially started
    let parent = components[parentIndex];
    console.log(parent.children);
    for (let i: number = 0; i < parent.children.length; i++) {
        console.log(i);
        newComponents = newComponents.map((comp) => {
            if (comp.id == parent.children[i]) {
                console.log("Found id: " + comp.id);
                return {
                    ...comp,
                    sequenceNumber: i,
                };
            }
            return comp;
        });
    }
    return newComponents;
};

const DeleteComponent = (component: Component, state: Component[]): Component[] => {
    let id: number = component.id;
    let children: number[] = component.children;
    let parentId: number = component.parent;
    let components: Component[] = state;
    let componentIndex: number = GetComponentIndex(components, component);
    let parentIndex: number = GetParentIndex(components, parentId);
    let hasSiblings: boolean = GetSiblings(components, parentIndex);
    if (parentIndex < 0) {
        console.error("Parent Component does not exist");
        return;
    }
    if (LengthIsOne(components)) {
        console.warn("Canvas does not contain anything");
    }
    if (parent) {
        components = RemoveIdFromParent(components, parentIndex, id, parentId);
    }
    if (children) {
        components = RemoveChildren(components, parentIndex, component);
    }
    components.splice(componentIndex, 1);
    if (hasSiblings && !IsLastChild(components, parentIndex, id)) {
        components = ChangeSequenceNumbers(components, parentIndex, id);
    }
    return components;
};

const UndoRedoComponent = (undo: Undo[], components: Component[]): Component[] => {
    let component: Component = null;

    let newComponents: Component[] = components.map((comp) => {
        if (comp.id === undo[undo.length - 1].id) {
            component = comp;
            return comp;
        }
        return comp;
    });
    if (!component) {
        return components;
    }

    let newComponent: Undo = undo[undo.length - 1];
    if (component) {
        let idx: number = newComponents.indexOf(component);
        newComponents.splice(idx, 1);
        newComponents.push(newComponent);
        return BuildComponentOrder(newComponents);
    }
    newComponents.push(component);
    return BuildComponentOrder(newComponents);
};

const PushParents = (oldComponents: Component[], state: Component[]): Component[] => {
    let currentComponents: Component[] = state.map((i) => i);
    oldComponents.map((oldComp) => {
        if (!currentComponents.includes(oldComp)) {
            console.log("doesnt include: " + oldComp.id);
            console.log(oldComponents);
            let parentIdx: number = currentComponents.findIndex((comp) => comp.id === oldComp.parent);
            let oldIdx: number = oldComponents.findIndex((comp) => comp.id === oldComp.parent);
            currentComponents[parentIdx].children = oldComponents[oldIdx].children;
            currentComponents.push(oldComp);
        }
    });
    return BuildComponentOrder(currentComponents);
};

const GetPreviousComponentArray = (lastUndo: Array<any>): Component[] => {
    return lastUndo[lastUndo.length - 1].comp;
};

const UndoDeleteComponents = (lastUndo: Array<any>, state: Component[]): Component[] => {
    let previousComponents: any[] = [lastUndo[lastUndo.length - 1].comp];
    return PushParents(previousComponents[0], state);
};

const EditComponent = (state: Component[], newComponent: Component): Component[] => {
    state.map((component) => {
        if (component.id === newComponent.id) {
            return { ...component, ...newComponent };
        }
        return component;
    });
    return state;
};

const EditComponents = (state: Component[], newComponents: Component[]): Component[] => {
    state.map((component) => {
        newComponents.forEach((comp) => {
            if (comp.id === component.id) {
                return comp;
            }
        });
        return component;
    });
    return state;
};

const PasteComponent = (components: Component[], id: number, copiedComponent: CopiedComponent): Component[] => {
    console.log("Pasting component, " + id);
    return components.map((component) => {
        if (id === component.id) {
            return {
                ...component,
                ...copiedComponent,
            };
        }
        return component;
    });
};

const componentReducer = (state = componentsReducerDefaultState, action: AppActions) => {
    switch (action.type) {
        case ADD_COMPONENT:
            return BuildComponentOrder(AddComponent([...state, action.component]));
        case EDIT_COMPONENT:
            return EditComponent(state, action.component);
        case EDIT_COMPONENTS:
            return BuildComponentOrder(EditComponents(state, action.components));
        case PASTE_COMPONENT:
            return PasteComponent(state, action.id, action.copiedComponent);
        case DELETE_COMPONENT:
            return DeleteComponent(action.component, state);
        case SET_COMPONENTS:
            return BuildComponentOrder(action.components);
        case UNDO_COMPONENT:
            return UndoRedoComponent(action.history.undo, state);
        case UNDO_COMPONENTS:
            return GetPreviousComponentArray(action.history.undo);
        case UNDO_DELETE_COMPONENTS:
            return UndoDeleteComponents(action.history.undo, state);
        case REDO_COMPONENT:
            return UndoRedoComponent(action.history.redo, state);
        default:
            return state;
    }
};

export { componentReducer };
