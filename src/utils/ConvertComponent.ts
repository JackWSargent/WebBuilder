import { Component, CopiedComponent } from "../redux/types/actions";

export const ConvertToCopiedComponent = (component: Component): CopiedComponent => {
    if (component) {
        return {
            name: component.name ? component.name : "",
            type: component.type ? component.type : "",
            innerText: component.innerText ? component.innerText : "",
        };
    }
};

//TODO: ADD BACK IN ALL OTHER PARTS OF THE COMPONENT OBJECT IF NEED BE
export const ConvertToComponent = (copiedComponent: CopiedComponent, id: number): Component => {
    if (copiedComponent) {
        return {
            id,
            ...copiedComponent,
        };
    }
};
