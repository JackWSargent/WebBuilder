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
import { copyFileSync } from "fs";

interface RendererProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        renderer: {
            minWidth: "100vh",
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
    const { components, canvasStyling } = props;
    const classes = useStyles();
    const [renderedComponents, setRenderedComponents] = React.useState([]);

    const returnComponent = component => {
        let id: number = component.id;
        let name: string = component.name;
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
        if (childrenVal) {
            return <div key={id}>{returnChildren(component)}</div>;
        }
        return <div key={id}></div>;
    };

    const returnChildren = (component): Array<JSX.Element> => {
        if (!component.active) {
            return [];
        }
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
    First start while loop and look at the first idx, it will be a root of one of the rows.
    Send it to the render function where it first checks if there are children.
    If not the component will be sent to the returnComponent function
    If there are children then it will be sent to the returnComponent function and also have to trigger the function nested inside it to render the children/child.
    It will run a loop of the children and all render them and check for their children and 
    do the work again to go through the children.
    */

    const reRenderComponents = (): void => {
        //Check for times rendered
        renderTimes = renderTimes + 1;
        //Check for style or properties changes and reset rendered elements
        if (canvasStyleChange) {
            setRenderedComponents([]);
        } else if (componentChange) {
            renderedComponents2 = [];
        }
        //Reset is rendered on the elements
        newComponents = components.map(element => {
            let componentObject: Components = Object.assign({}, element);
            componentObject.isRendered = false;
            return componentObject;
        });
        // console.log(newComponents);
        // Init and check to see if there are any elements
        let component: Components = newComponents[idx];
        if (component && component.active) {
            // Check to make sure that it is not rendered already
            if (component.isRendered || !component.active) {
                console.warn("not rendering element: " + component.id);
                return;
            }
            // Init a new array to
            let newRenderedComponents: JSX.Element[] = [];
            setRenderedComponents([]);
            renderedComponents2 = [];
            for (let i: number = 1; i < newComponents.length; i++) {
                component = newComponents[idx];
                if (!component || component.isRendered == true || component.parent !== null) {
                    // console.error(idx);
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
                renderedComponents2 = newRenderedComponents;
            }
        } else {
            renderedComponents2 = [];
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
        return renderedComponents2;
    };

    React.useEffect(() => {
        canvasStyleChange = true;
        reRenderComponents();
    }, [canvasStyling]);

    React.useEffect(() => {
        reRenderComponents();
        console.log(newComponents);
    }, [newComponents]);

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
