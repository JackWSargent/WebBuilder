import * as React from "react";
/* eslint-disable */
import "../App.css";
import Layer from "./Layer";
import CanvasDisplay from "./Canvas";
import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { SetCanvas } from "../redux/actions/canvas";
import { UndoHistory, RedoHistory } from "../redux/actions/history";
import { KeyDown, KeyUp } from "../redux/actions/keyPress";
import { Canvas, History, Undo, Redo, KeyPress } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: "#666666",
            color: "#fff",
        },
    })
);
interface LayoutProps {}

type Props = LayoutProps & LinkStateProps & LinkDispatchProps;
const Layout: React.FC<Props> = (props) => {
    const { canvas, keyPress, history } = props;

    const classes = useStyles();
    const theme = useTheme();

    window.addEventListener("keydown", (event) => {
        if (!keyPress[event.keyCode]) {
            props.KeyDown(event.keyCode);
        }
    });
    window.addEventListener("keyup", (event) => {
        props.KeyUp(event.keyCode);
    });

    const PressingUndo = (): boolean => {
        return keyPress["z"] && keyPress["ctrl"] ? true : false;
    };

    const PressingRedo = (): boolean => {
        return keyPress["y"] && keyPress["ctrl"] ? true : false;
    };

    React.useEffect(() => {
        if (PressingUndo()) {
        }
        if (PressingRedo()) {
        }
    }, [canvas.drawerOpen, keyPress]);

    const renderComponents = () => {
        return (
            <div className={classes.root}>
                <Layer />
                <CanvasDisplay />
            </div>
        );
    };

    /* eslint-enable */
    return <div className="App">{renderComponents()}</div>;
};

interface LinkStateProps {
    canvas: Canvas;
    keyPress: KeyPress;
    history: History;
}

const mapStateToProps = (state: AppState, ownProps: LayoutProps): LinkStateProps => ({
    canvas: state.canvas,
    keyPress: state.keyPress,
    history: state.history,
});

interface LinkDispatchProps {
    SetCanvas: (canvas: Canvas) => void;
    KeyUp: (keyPress: KeyPress) => void;
    KeyDown: (keyPress: KeyPress) => void;
    UndoHistory: () => void;
    RedoHistory: () => void;
}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: LayoutProps
): LinkDispatchProps => ({
    SetCanvas: bindActionCreators(SetCanvas, dispatch),
    KeyUp: bindActionCreators(KeyUp, dispatch),
    KeyDown: bindActionCreators(KeyDown, dispatch),
    UndoHistory: bindActionCreators(UndoHistory, dispatch),
    RedoHistory: bindActionCreators(RedoHistory, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
