import * as React from "react";
/* eslint-disable */
import "../App.css";
import Layer from "./Layer";
import CanvasDisplay from "./Canvas";
import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { SetCanvas } from "../redux/actions/canvas";
import { AddHistory, UndoHistory, RedoHistory, EnableDispatch, AddRedoHistory } from "../redux/actions/history";
import { SetCanvasStyling } from "../redux/actions/canvasStyling";
import {
    SetComponents,
    EditComponent,
    AddComponent,
    EditComponents,
    PasteComponent,
    DeleteComponent,
    UndoComponent,
    RedoComponent,
} from "../redux/actions/components";
import { KeyDown, KeyUp } from "../redux/actions/keyPress";
import { Canvas, History, Undo, Redo, KeyPress, CanvasStyling, Component } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";
import { canDispatch, historyReducer } from "../redux/reducers/history";
import { store } from "../redux/store/storeConfiguration";

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
    const { canvas, keyPress, history, canvasStyling, components } = props;

    const classes = useStyles();
    const theme = useTheme();

    const [undoArr, setUndoArr] = React.useState(history.undo);

    const PressingUndo = (): boolean => {
        return keyPress["z"] === true && keyPress["ctrl"] === true && !keyPress["y"] ? true : false;
    };

    const PressingRedo = (): boolean => {
        return keyPress["z"] === false && keyPress["y"] && keyPress["ctrl"] ? true : false;
    };

    const PressingCTRL = (): boolean => {
        return keyPress["ctrl"] === true ? true : false;
    };

    React.useEffect(() => {
        console.log("undo arr:  ", history.undo);
        setUndoArr(history.undo);
        const otherUndo = history.undo;

        window.addEventListener("keydown", (event) => {
            if (!keyPress[event.keyCode] || keyPress[event.keyCode] === false) {
                props.KeyDown(event.keyCode);
            }
            // Take away browsers abilities to mess with undo and redo
            if (PressingCTRL()) {
                event.preventDefault();
            }
            // console.log("undo arr:  ", otherUndo);

            if (PressingUndo() && canDispatch && history.undo.length > 0) {
                // If latest action was done on a component
                let newUndo = store.getState().history.undo;
                if (newUndo[newUndo.length - 1].id) {
                    let component = components.filter((comp) => comp.id === newUndo[newUndo.length - 1].id);
                    let selectedComponent = component[0];
                    if (!selectedComponent) {
                        console.error("Undo Component is null", selectedComponent);
                    }
                    props.UndoComponent(newUndo); // Activates Undo
                    props.UndoHistory(selectedComponent);
                }
            }
        });
        window.addEventListener("keyup", (event) => {
            props.KeyUp(event.keyCode);
            props.EnableDispatch();
            event.preventDefault();
        });
    }, [canvas.drawerOpen, components, history]);

    const renderComponents = (): JSX.Element => {
        return (
            <div className={classes.root}>
                <Layer />
                <CanvasDisplay />
            </div>
        );
    };

    return <div className="App">{renderComponents()}</div>;
};

interface LinkStateProps {
    canvas: Canvas;
    keyPress: KeyPress;
    history: History;
    canvasStyling: CanvasStyling;
    components: Component[];
}

const mapStateToProps = (state: AppState, ownProps: LayoutProps): LinkStateProps => ({
    canvas: state.canvas,
    keyPress: state.keyPress,
    history: state.history,
    canvasStyling: state.canvasStyling,
    components: state.components,
});

interface LinkDispatchProps {
    SetCanvas: (canvas: Canvas) => void;
    KeyUp: (keyPress: KeyPress) => void;
    KeyDown: (keyPress: KeyPress) => void;
    AddHistory: (history: History, components?: Component[]) => void;
    UndoHistory: (redo: Redo) => void;
    RedoHistory: () => void;
    EnableDispatch: () => void;
    SetCanvasStyling: (canvasStyling: CanvasStyling) => void;
    SetComponents: (components: Component[]) => void;
    AddComponent: (component: Component) => void;
    EditComponent: (component: Component) => void;
    PasteComponent: (id: number) => void;
    UndoComponent: (undo: Undo[]) => void;
    RedoComponent: (redo: Redo[]) => void;
    AddRedoHistory: (history: History) => void;
}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: LayoutProps
): LinkDispatchProps => ({
    SetCanvas: bindActionCreators(SetCanvas, dispatch),
    KeyUp: bindActionCreators(KeyUp, dispatch),
    KeyDown: bindActionCreators(KeyDown, dispatch),
    AddHistory: bindActionCreators(AddHistory, dispatch),
    RedoHistory: bindActionCreators(RedoHistory, dispatch),
    UndoHistory: bindActionCreators(UndoHistory, dispatch),
    EnableDispatch: bindActionCreators(EnableDispatch, dispatch),
    SetCanvasStyling: bindActionCreators(SetCanvasStyling, dispatch),
    SetComponents: bindActionCreators(SetComponents, dispatch),
    AddComponent: bindActionCreators(AddComponent, dispatch),
    EditComponent: bindActionCreators(EditComponent, dispatch),
    PasteComponent: bindActionCreators(PasteComponent, dispatch),
    UndoComponent: bindActionCreators(UndoComponent, dispatch),
    RedoComponent: bindActionCreators(RedoComponent, dispatch),
    AddRedoHistory: bindActionCreators(AddRedoHistory, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
