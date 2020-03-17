import * as React from "react";
import { connect } from "react-redux";
import { startSetCanvas } from "../redux/actions/canvas";
import { Canvas } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";
import clsx from "clsx";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
interface CanvasProps {}
let defaultSize: number = 16;
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        divider: {
            zIndex: 1250,
            cursor: "ew-resize",
            top: 0,
            position: "absolute",
            height: "100%",
            width: 4
        },
        toggleOff: {
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            position: "fixed",
            zIndex: 1150,
            fontSize: defaultSize
        },
        toggleOn: {
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            position: "fixed",
            zIndex: 1300,
            fontSize: defaultSize
        },
        canvasContainer: {
            height: "100%",
            width: "100%",
            minHeight: "100vh",
            fontSize: defaultSize
        },
        topMargin: {
            marginTop: 64,
            fontSize: defaultSize
        }
    })
);

type Props = CanvasProps & LinkStateProps & LinkDispatchProps;
const CanvasDisplay: React.FC<Props> = props => {
    const { canvas } = props;
    const classes = useStyles();
    const [leftMargin, setLeftMargin] = React.useState(
        canvas[0].drawerLeftMargin
    );
    const [marginToggle, setMarginToggle] = React.useState(
        canvas[0].drawerClicked
    );

    const changeMargin = (event: React.MouseEvent<HTMLElement>): void => {
        let val = Math.min(600, event.clientX);
        val = Math.max(240, event.clientX);
        if (canvas[0].drawerOpen && canvas[0].drawerClicked) {
            setLeftMargin(val);
            let canvasVal = [
                {
                    drawerOpen: canvas[0].drawerOpen,
                    drawerLeftMargin: val,
                    drawerClicked: marginToggle
                }
            ];
            props.startSetCanvas(canvasVal);
        }
    };

    const handleMarginClick = (): void => {
        if (marginToggle) {
            setMarginToggle(false);
            props.startSetCanvas([
                {
                    drawerOpen: canvas[0].drawerOpen,
                    drawerLeftMargin: leftMargin,
                    drawerClicked: false
                }
            ]);
            return;
        }
        setMarginToggle(true);
        let val = [{ ...canvas[0], drawerClicked: true }];
        props.startSetCanvas([
            {
                drawerOpen: canvas[0].drawerOpen,
                drawerLeftMargin: canvas[0].drawerLeftMargin,
                drawerClicked: true
            }
        ]);
    };

    const renderMargin = () => {
        if (canvas[0].drawerOpen === true) {
            return (
                <>
                    <div
                        className={classes.canvasContainer + classes.topMargin}
                        style={{ fontSize: defaultSize }}
                    >
                        <div
                            style={{
                                marginTop: 64,
                                minHeight: "100vh",
                                zIndex: 1400
                            }}
                        >
                            TEXT
                        </div>
                    </div>
                    <div
                        id="mouse-detection"
                        className={clsx(classes.toggleOff, {
                            [classes.toggleOn]: marginToggle
                        })}
                        onMouseMove={changeMargin}
                        style={{ fontSize: defaultSize }}
                    >
                        <div
                            id="margin-resize"
                            className={classes.divider}
                            style={{
                                marginLeft: leftMargin
                            }}
                            onMouseMove={changeMargin}
                            onMouseDown={handleMarginClick}
                            onMouseUp={handleMarginClick}
                        ></div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div
                        className={classes.canvasContainer + classes.topMargin}
                        style={{ marginTop: 64, fontSize: defaultSize }}
                    >
                        <div style={{ minHeight: "100vh", zIndex: 1400 }}>
                            TEXT
                        </div>
                    </div>
                </>
            );
        }
    };

    return <>{renderMargin()}</>;
};
interface LinkStateProps {
    canvas: Canvas[];
}

const mapStateToProps = (
    state: AppState,
    ownProps: CanvasProps
): LinkStateProps => ({
    canvas: state.canvas
});

interface LinkDispatchProps {
    startSetCanvas: (canvas: Canvas[]) => void;
}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: CanvasProps
): LinkDispatchProps => ({
    startSetCanvas: bindActionCreators(startSetCanvas, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CanvasDisplay);
