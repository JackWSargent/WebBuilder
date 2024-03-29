import * as React from "react";
/* eslint-disable */
import { connect } from "react-redux";
import { SetCanvas } from "../redux/actions/canvas";
import { Component, Canvas } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";
import clsx from "clsx";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { SetComponents } from "../redux/actions/components";
import Renderer from "./Renderer";
interface CanvasProps {}
let defaultSize: number = 24;
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        divider: {
            zIndex: 1250,
            cursor: "ew-resize",
            top: 0,
            position: "absolute",
            height: "100%",
            width: 4,
        },
        toggleOff: {
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            position: "fixed",
            zIndex: 1150,
            fontSize: defaultSize,
        },
        toggleOn: {
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            position: "fixed",
            zIndex: 1300,
            fontSize: defaultSize,
        },
        canvasContainer: {
            height: "100%",
            width: "100%",
            minHeight: "100vh",
            fontSize: defaultSize,
            backgroundColor: "#666666",
        },
        topMargin: {
            marginTop: 64,
            fontSize: defaultSize,
        },
    })
);

type Props = CanvasProps & LinkStateProps & LinkDispatchProps;
const CanvasDisplay: React.FC<Props> = (props) => {
    const { canvas } = props;
    const classes = useStyles();

    const RenderMargin = (): JSX.Element => {
        if (canvas.drawerOpen === true) {
            return (
                <>
                    <div className={classes.canvasContainer} style={{ fontSize: defaultSize }}>
                        <div
                            style={{
                                marginTop: 64,
                                minHeight: "100vh",
                                marginLeft: canvas.drawerLeftMargin,
                                marginRight: canvas.drawerLeftMargin,
                                zIndex: 1400,
                                justifyContent: "center",
                                alignContent: "center",
                            }}>
                            <Renderer />
                        </div>
                    </div>
                    <div
                        id="mouse-detection"
                        className={classes.canvasContainer}
                        style={{ fontSize: defaultSize }}></div>
                </>
            );
        } else {
            return (
                <>
                    <div
                        className={classes.canvasContainer + classes.topMargin}
                        style={{ marginTop: 64, fontSize: defaultSize }}>
                        <div
                            style={{
                                paddingTop: 64,
                                minHeight: "100vh",
                                zIndex: 1400,
                            }}>
                            <Renderer />
                        </div>
                    </div>
                </>
            );
        }
    };

    return <>{RenderMargin()}</>;
};
interface LinkStateProps {
    components: Component[];
    canvas: Canvas;
}

const mapStateToProps = (state: AppState, ownProps: CanvasProps): LinkStateProps => ({
    components: state.components,
    canvas: state.canvas,
});

interface LinkDispatchProps {
    SetComponents: (components: Component[]) => void;
    SetCanvas: (canvas: Canvas) => void;
}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: CanvasProps
): LinkDispatchProps => ({
    SetComponents: bindActionCreators(SetComponents, dispatch),
    SetCanvas: bindActionCreators(SetCanvas, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CanvasDisplay);
