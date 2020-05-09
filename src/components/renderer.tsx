import * as React from "react";
/* eslint-disable */
import { connect } from "react-redux";
import { SetCanvas } from "../redux/actions/canvas";
import { Component, Canvas } from "../redux/types/actions";
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
        layer: {},
        layerSelected: {
            borderStyle: "dashed",
            borderWidth: "1px",
            borderColor: "#668ace",
        },
        layerSelectedContainer: {
            borderStyle: "dashed",
            borderWidth: "2px",
            borderColor: "#668ace",
        },
        layerSelectedCanvas: {
            borderStyle: "dashed",
            borderWidth: "3px",
            borderColor: "#668ace",
        },
    })
);

let idx: number = 0;
let renderTimes: number = 0;
let newComponents = [];
let canvasStyleChange: boolean = false;
let componentChange: boolean = false;
let renderedComponentsArr: JSX.Element[] = [];

type Props = RendererProps & LinkStateProps & LinkDispatchProps;
const Renderer: React.FC<Props> = (props) => {
    const { components, canvasStyling, canvas } = props;
    const classes = useStyles();
    const [renderedComponents, setRenderedComponents] = React.useState([]);

    const returnComponent = (layer) => {
        let id: number = layer.id;
        let name: string = layer.name;
        let innerText: string = layer.innerText;
        let childrenVal: boolean = layer.children !== null;
        switch (layer.type) {
            case "gridContainer":
                if (childrenVal) {
                    return (
                        <Grid
                            container
                            id={name}
                            key={id}
                            className={clsx(classes.layer, {
                                [classes.layerSelectedContainer]: layer.selected,
                            })}>
                            {innerText}
                            {returnChildren(layer)}
                        </Grid>
                    );
                }
                return (
                    <Grid
                        container
                        id={name}
                        key={id}
                        className={clsx(classes.layer, {
                            [classes.layerSelectedContainer]: layer.selected,
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
                            className={clsx(classes.layer, {
                                [classes.layerSelected]: layer.selected,
                            })}>
                            {innerText}
                            {returnChildren(layer)}
                        </Grid>
                    );
                }
                return (
                    <Grid
                        item
                        id={name}
                        key={id}
                        className={clsx(classes.layer, {
                            [classes.layerSelected]: layer.selected,
                        })}>
                        {innerText}
                    </Grid>
                );
            case "canvas":
                if (childrenVal) {
                    return (
                        <div
                            id={name}
                            key={id}
                            className={clsx(classes.layer, {
                                [classes.layerSelectedCanvas]: layer.selected,
                            })}>
                            {innerText}
                            {returnChildren(layer)}
                        </div>
                    );
                }
                return (
                    <div
                        id={name}
                        key={id}
                        className={clsx(classes.layer, {
                            [classes.layerSelectedCanvas]: layer.selected,
                        })}>
                        {innerText}
                    </div>
                );
            default:
                if (childrenVal) {
                    return (
                        <div
                            id={name}
                            key={id}
                            className={clsx(classes.layer, {
                                [classes.layerSelected]: layer.selected,
                            })}>
                            {innerText}
                            {returnChildren(layer)}
                        </div>
                    );
                }
                return (
                    <div
                        id={name}
                        key={id}
                        className={clsx(classes.layer, {
                            [classes.layerSelected]: layer.selected,
                        })}>
                        {innerText}
                    </div>
                );
        }
        // }
        // if (childrenVal) {
        //     return <div key={id}>{returnChildren(layer)}</div>;
        // }
        // return <div key={id}></div>;
    };

    const returnChildren = (layer): Array<JSX.Element> => {
        let childrenArr: JSX.Element[] = [];
        for (let i = 1; i < layer.children.length + 1; i++) {
            idx = idx + 1;
            let layer = newComponents[idx];
            if (layer == null || layer.isRendered) {
                return;
            }
            layer.isRendered = true;
            childrenArr.push(returnComponent(layer));
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
        //Check for times rendered
        renderTimes = renderTimes + 1;
        // console.log("reRendering, render times: " + renderTimes);
        //Check for style or properties changes and reset rendered elements
        if (canvasStyleChange) {
            setRenderedComponents([]);
            // console.log("changing state");
        } else if (componentChange) {
            // console.log("changing components line 133");
            renderedComponentsArr = [];
        }
        //Reset is rendered on the elements
        // let oldComponents = newComponents.map((el) => {
        //     return el;
        // });
        if (newComponents.length === 1 && newComponents[0].isRendered == true) {
            console.log("rendered the first component");
            return;
        }
        newComponents = components.map((element) => {
            let componentObject: Component = Object.assign({}, element);
            componentObject.isRendered = false;
            return componentObject;
        });

        // console.log(newComponents);
        // Init and check to see if there are any elements
        let layer: Component = newComponents[idx];
        if (layer) {
            // Check to make sure that it is not rendered already
            if (layer.isRendered) {
                // console.warn("not rendering element: " + component.id);
                return;
            }
            // Init a new array to
            let newRenderedComponents: JSX.Element[] = [];
            // setRenderedComponents([]); ----------------------
            renderedComponentsArr = [];
            if (components.length === 1) {
                renderedComponentsArr = [returnComponent(newComponents[idx])];
                setRenderedComponents([returnComponent(newComponents[idx])]);
                idx = idx + 1;
                return;
            }
            for (let i: number = 1; i < newComponents.length; i++) {
                layer = newComponents[idx];
                if (!layer || layer.isRendered == true || layer.parent !== null) {
                    return;
                }
                if (i == 1 && renderedComponents.length > 0) {
                    newRenderedComponents = newRenderedComponents.concat(returnComponent(layer));
                } else {
                    newRenderedComponents = renderedComponents.concat(returnComponent(layer));
                }
                layer.isRendered = true;

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
        if (canvasStyling[0].boxSizing == "border-box") {
            return "border-box";
        } else {
            return "content-box";
        }
    };

    const getFontSizing = () => {
        return canvasStyling[0].fontSize.toString() + "px";
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
    }, [components, newComponents, renderedComponentsArr]);

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
    canvas: Canvas[];
    canvasStyling: CanvasStyling[];
}

const mapStateToProps = (state: AppState, ownProps: RendererProps): LinkStateProps => ({
    components: state.components,
    canvas: state.canvas,
    canvasStyling: state.canvasStyling,
});

interface LinkDispatchProps {
    SetComponents: (components: Component[]) => void;
    SetCanvas: (canvas: Canvas[]) => void;
}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: RendererProps
): LinkDispatchProps => ({
    SetComponents: bindActionCreators(SetComponents, dispatch),
    SetCanvas: bindActionCreators(SetCanvas, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Renderer);
