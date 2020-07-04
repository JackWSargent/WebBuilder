import { Component, CopiedComponent } from "../redux/types/actions";
import { store } from "../redux/store/storeConfiguration";

export const ConvertToCopiedComponent = (component: Component): CopiedComponent => {
    if (component) {
        return {
            name: component.name ? component.name : "",
            type: component.type ? component.type : "",
            innerText: component.innerText ? component.innerText : "",
        };
    }
};

export const ConvertToComponent = (copiedComponent: CopiedComponent, id: number): Component => {
    let compValues = store.getState().components.filter((el) => el.id === id);
    if (compValues.length === 1) {
        let componentValues = compValues[0];
        if (copiedComponent) {
            return {
                id,
                ...componentValues,
                ...copiedComponent,
            };
        }
    }
};
