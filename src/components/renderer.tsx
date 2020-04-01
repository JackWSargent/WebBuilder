import * as React from "react";
/* eslint-disable */
import { connect } from "react-redux";
import { SetCanvas } from "../redux/actions/canvas";
import { Components, Canvas } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";
// import clsx from "clsx";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { SetComponents } from "../redux/actions/components";
import { Grid } from "@material-ui/core";
import { CanvasStyling } from "../redux/types/actions";
import { SetCanvasStyling } from "../redux/actions/canvasStyling";
import { convertColorToString } from "material-ui/utils/colorManipulator";

interface RendererProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        renderer: {
            minWidth: "100vh",
            // boxSizing: "inherit",
            maxWidth: "100vh",
            width: 1000
        }
    })
);

let idx: number = 0;
let renderTimes: number = 0;
let newComponents = [];
let canvasStyleChange: boolean = false;
let componentChange: boolean = false;
let renderedComponents2: JSX.Element[] = [];
let defaultSize: number = 24;

type Props = RendererProps & LinkStateProps & LinkDispatchProps;
const Renderer: React.FC<Props> = props => {
    const { canvas, components, canvasStyling } = props;
    const classes = useStyles();
    const [renderedComponents, setRenderedComponents] = React.useState([]);
    // const [idx, setIdx] = React.useState(0);

    const returnComponent = (component): JSX.Element => {
        let id: number = component.id;
        let name: string = component.name;
        // console.log("made it to returning the component");
        let childrenVal: boolean = component.children !== null;
        if (component.active) {
            switch (component.type) {
                case "gridContainer":
                    if (childrenVal) {
                        return (
                            <Grid container id={name} key={id}>
                                {id + " " + name} . {returnChildren(component)}
                            </Grid>
                        );
                    }
                    return (
                        <Grid container id={name} key={id}>
                            {id + " " + name}.........
                        </Grid>
                    );
                case "gridItem":
                    if (childrenVal) {
                        return (
                            <Grid item id={name} key={id}>
                                {id + " " + name} .. {returnChildren(component)}
                            </Grid>
                        );
                    }
                    return (
                        <Grid item id={name} key={id}>
                            {id + " " + name}...
                        </Grid>
                    );
                default:
                    if (childrenVal) {
                        return (
                            <div id={name} key={id}>
                                {id} {name}
                                {returnChildren(component)}
                            </div>
                        );
                    }
                    return (
                        <div id={name} key={id}>
                            {id}
                        </div>
                    );
            }
        }
        return <></>;
    };

    const returnChildren = (component): Array<JSX.Element> => {
        // console.log("returning children for: " + component.id);
        let childrenArr: JSX.Element[] = [];
        for (let i = 1; i < component.children.length + 1; i++) {
            idx = idx + 1;
            let component = newComponents[idx];
            if (component == null || component.isRendered) {
                // console.warn(component.id + " is rendered as child, exiting");
                return;
            }
            // console.log(idx);

            component.isRendered = true;
            childrenArr.push(returnComponent(component));
            // console.warn("rendering components after rendering children");
            // console.log(newComponents);
        }
        // idx = idx + component.children.length;
        return childrenArr;
    };

    /*
    First start while loop and look at the first idx, it will be a root of one of the rows.
    Send it to the render function where it first checks if there are children.
    If not the component will be sent to the returnComponent function
    If there are children then it will be sent to the returnComponent function and also have to trigger the function nested inside it to render the children/child.
    It will run a loop of the children and all render them and check for their children and 
    do the work again to go through the children.
    */

    const reRenderComponents = (): void => {
        renderTimes = renderTimes + 1;
        if (canvasStyleChange) {
            setRenderedComponents([]);
        }
        // else if (componentChange) {
        //     setRenderedComponents([]);
        // }

        newComponents = components.map(element => {
            let componentObject: Components = Object.assign({}, element);
            componentObject.isRendered = false;
            return componentObject;
        });
        // console.error("re running reRenderComponents, should be not rendered");
        // console.log(newComponents);
        let component: Components = newComponents[idx];
        if (component) {
            if (component.isRendered) {
                // console.warn("not rendering element: " + component.id);
                return;
            }

            let newRenderedComponents: JSX.Element[] = [];
            setRenderedComponents([]);
            for (let i: number = 1; i < newComponents.length; i++) {
                component = newComponents[idx];
                // console.log(idx);
                if (!component) {
                    // console.error("component is undefined, current idx: " + idx);
                    return;
                }
                if (component.isRendered == true || component.parent !== null) {
                    // console.warn("rendered supposedly already: " + component.id);
                    // console.log(component);
                    // console.error("exiting out of rendering function");
                    return;
                }

                newRenderedComponents = renderedComponents.concat(returnComponent(component));
                component.isRendered = true;

                // console.log("rendering: " + component.id);
                // console.log("reRenderComponents(): setting isRendered: " + component.id + " to true");

                // console.log("current idx: " + idx + " setting idx to: " + (idx + 1));

                idx = idx + 1;
                setRenderedComponents(newRenderedComponents);
            }
        } else {
            // console.error("component is null");
            idx = 0;
            canvasStyleChange = false;
            componentChange = false;
            // setRenderedComponents([]);
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
        return renderedComponents;
    };

    React.useEffect(() => {
        canvasStyleChange = true;
        reRenderComponents();
        // console.log("triggered1");
    }, [canvasStyling]);

    React.useEffect(() => {
        // componentChange = true;
        reRenderComponents();
        // console.log("triggered2");
    }, [newComponents]);

    // React.useEffect(() => {}, [renderedComponents]);

    return (
        <div
            id="renderer-component"
            className={classes.renderer}
            style={{
                fontSize: getFontSizing(),
                boxSizing: getSizing()
            }}>
            {renderComponents()}
        </div>
    );
};
interface LinkStateProps {
    components: Components[];
    canvas: Canvas[];
    canvasStyling: CanvasStyling[];
}

const mapStateToProps = (state: AppState, ownProps: RendererProps): LinkStateProps => ({
    components: state.components,
    canvas: state.canvas,
    canvasStyling: state.canvasStyling
});

interface LinkDispatchProps {
    SetComponents: (components: Components[]) => void;
    SetCanvas: (canvas: Canvas[]) => void;
}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: RendererProps
): LinkDispatchProps => ({
    SetComponents: bindActionCreators(SetComponents, dispatch),
    SetCanvas: bindActionCreators(SetCanvas, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Renderer);
