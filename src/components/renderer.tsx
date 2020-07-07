import * as React from "react";
/* eslint-disable */
import { connect } from "react-redux";
import { SetCanvas } from "../redux/actions/canvas";
import { Component, Canvas, History } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { SetComponents } from "../redux/actions/components";
import { Grid } from "@material-ui/core";
import { CanvasStyling } from "../redux/types/actions";
import clsx from "clsx";

interface RendererProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        renderer: {
            minWidth: "100%",
            width: "100%",
        },
        component: {},
        componentSelected: {
            borderStyle: "dashed",
            borderWidth: "1px",
            borderColor: "#668ace",
        },
        componentSelectedContainer: {
            borderStyle: "dashed",
            borderWidth: "2px",
            borderColor: "#668ace",
        },
        componentSelectedCanvas: {
            borderStyle: "dashed",
            borderWidth: "3px",
            borderColor: "#668ace",
        },
    })
);

let idx: number = 0;
// let renderTimes: number = 0;
let newComponents = [];
let canvasStyleChange: boolean = false;
let componentChange: boolean = false;
let renderedComponentsArr: JSX.Element[] = [];

type Props = RendererProps & LinkStateProps & LinkDispatchProps;
const Renderer: React.FC<Props> = (props) => {
    const { components, canvasStyling, canvas, history } = props;
    const classes = useStyles();
    const [renderedComponents, setRenderedComponents] = React.useState([]);

    const returnComponent = (component) => {
        let id: number = component.id;
        let name: string = component.name;
        let innerText: string = component.innerText;
        let childrenVal: boolean = component.children !== null;
        switch (component.type) {
            case "canvas":
                if (childrenVal) {
                    return (
                        <div
                            id={name}
                            key={id}
                            className={clsx(classes.component, {
                                [classes.componentSelectedCanvas]: component.selected,
                            })}>
                            {innerText}
                            {returnChildren(component)}
                        </div>
                    );
                }
                return (
                    <div
                        id={name}
                        key={id}
                        className={clsx(classes.component, {
                            [classes.componentSelectedCanvas]: component.selected,
                        })}>
                        {innerText}
                    </div>
                );
            case "gridContainer":
                if (childrenVal) {
                    return (
                        <Grid
                            container
                            id={name}
                            key={id}
                            className={clsx(classes.component, {
                                [classes.componentSelectedContainer]: component.selected,
                            })}>
                            {innerText}
                            {returnChildren(component)}
                        </Grid>
                    );
                }
                return (
                    <Grid
                        container
                        id={name}
                        key={id}
                        className={clsx(classes.component, {
                            [classes.componentSelectedContainer]: component.selected,
                        })}>
                        {innerText}
                    </Grid>
                );
            case "gridItem":
                if (childrenVal) {
                    return (
                        <Grid
                            item
                            id={name}
                            key={id}
                            className={clsx(classes.component, {
                                [classes.componentSelected]: component.selected,
                            })}>
                            {innerText}
                            {returnChildren(component)}
                        </Grid>
                    );
                }
                return (
                    <Grid
                        item
                        id={name}
                        key={id}
                        className={clsx(classes.component, {
                            [classes.componentSelected]: component.selected,
                        })}>
                        {innerText}
                    </Grid>
                );

            default:
                if (childrenVal) {
                    return (
                        <div
                            id={name}
                            key={id}
                            className={clsx(classes.component, {
                                [classes.componentSelected]: component.selected,
                            })}>
                            {innerText}
                            {returnChildren(component)}
                        </div>
                    );
                }
                return (
                    <div
                        id={name}
                        key={id}
                        className={clsx(classes.component, {
                            [classes.componentSelected]: component.selected,
                        })}>
                        {innerText}
                    </div>
                );
        }
        // }
        // if (childrenVal) {
        //     return <div key={id}>{returnChildren(component)}</div>;
        // }
        // return <div key={id}></div>;
    };

    const returnChildren = (component): Array<JSX.Element> => {
        let childrenArr: JSX.Element[] = [];
        for (let i = 1; i < component.children.length + 1; i++) {
            idx = idx + 1;
            let component = newComponents[idx];
            if (component == null || component.isRendered) {
                return;
            }
            component.isRendered = true;
            childrenArr.push(returnComponent(component));
        }
        return childrenArr;
    };

    /*
    First start while loop and look at the first idx, it will be a root
    Send it to the render function where it first checks if there are children.
    If not the component will be sent to the returnComponent function
    If there are children then it will be sent to the returnComponent function and also have to trigger the function nested inside it to render the children/child.
    It will run a loop of the children and all render them and check for their children and 
    do the work again to go through the children.
    */

    const reRenderComponents = (): void => {
        if (canvasStyleChange) {
            setRenderedComponents([]);
        } else if (componentChange) {
            renderedComponentsArr = [];
        }
        if (newComponents.length === 1 && newComponents[0].isRendered == true) {
            return;
        }
        newComponents = components.map((element) => {
            let componentObject: Component = Object.assign({}, element);
            componentObject.isRendered = false;
            return componentObject;
        });
        // Init and check to see if there are any elements
        let component: Component = newComponents[idx];
        if (component) {
            // Check to make sure that it is not rendered already
            if (component.isRendered) {
                return;
            }
            // Init a new array to
            let newRenderedComponents: JSX.Element[] = [];
            renderedComponentsArr = [];
            if (components.length === 1) {
                renderedComponentsArr = [returnComponent(newComponents[idx])];
                setRenderedComponents([returnComponent(newComponents[idx])]);
                idx = idx + 1;
                return;
            }
            for (let i: number = 1; i < newComponents.length; i++) {
                component = newComponents[idx];
                if (!component || component.isRendered == true || component.parent !== null) {
                    return;
                }
                if (i == 1 && renderedComponents.length > 0) {
                    newRenderedComponents = newRenderedComponents.concat(returnComponent(component));
                } else {
                    newRenderedComponents = renderedComponents.concat(returnComponent(component));
                }
                component.isRendered = true;

                idx = idx + 1;
                setRenderedComponents(newRenderedComponents);
                renderedComponentsArr = newRenderedComponents;
            }
        } else {
            renderedComponentsArr = [];
            idx = 0;
            canvasStyleChange = false;
            componentChange = false;
        }
    };

    const getSizing = () => {
        if (canvasStyling.boxSizing == "border-box") {
            return "border-box";
        } else {
            return "content-box";
        }
    };

    const getFontSizing = () => {
        return canvasStyling.fontSize.toString() + "px";
    };

    const renderComponents = (): JSX.Element[] => {
        return renderedComponentsArr;
    };

    React.useEffect(() => {
        canvasStyleChange = true;
        reRenderComponents();
    }, [canvasStyling]);

    React.useEffect(() => {
        reRenderComponents();
    }, [components, newComponents, renderedComponentsArr, history]);

    return (
        <div
            id="renderer-component"
            className={classes.renderer}
            style={{
                fontSize: getFontSizing(),
                boxSizing: getSizing(),
            }}>
            {renderComponents()}
        </div>
    );
};
interface LinkStateProps {
    components: Component[];
    canvas: Canvas;
    canvasStyling: CanvasStyling;
    history: History;
}

const mapStateToProps = (state: AppState, ownProps: RendererProps): LinkStateProps => ({
    components: state.components,
    canvas: state.canvas,
    canvasStyling: state.canvasStyling,
    history: state.history,
});

interface LinkDispatchProps {
    SetComponents: (components: Component[]) => void;
    SetCanvas: (canvas: Canvas) => void;
}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: RendererProps
): LinkDispatchProps => ({
    SetComponents: bindActionCreators(SetComponents, dispatch),
    SetCanvas: bindActionCreators(SetCanvas, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Renderer);
