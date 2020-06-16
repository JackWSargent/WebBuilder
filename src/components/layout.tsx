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

    const PressingUndo = (): boolean => {
        return keyPress["z"] && keyPress["ctrl"] && !keyPress["y"] ? true : false;
    };

    const PressingRedo = (): boolean => {
        return keyPress["y"] && keyPress["ctrl"] && !keyPress["z"] ? true : false;
    };
    //working on getting this to work when history is being watched and also not running it a million times and only once, probably by making sure that atleast z is false before enabling a new action on history to be dispatched,
    React.useEffect(() => {
        console.log("useEffect triggered");
        if (PressingUndo()) {
            console.log("fjdksafjsd");
            props.UndoHistory();
            console.log(history);
        }
        if (PressingRedo()) {
            props.RedoHistory();
        }
        window.addEventListener("keydown", (event) => {
            if (!keyPress[event.keyCode]) {
                props.KeyDown(event.keyCode);
            }
        });
        window.addEventListener("keyup", (event) => {
            props.KeyUp(event.keyCode);
        });
    }, [canvas.drawerOpen, history]);

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
