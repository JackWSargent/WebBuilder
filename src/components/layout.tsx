import * as React from "react";
/* eslint-disable */
import "../App.css";
import ComponentLayers from "./ComponentLayers";
import CanvasDisplay from "./Canvas";
import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { SetCanvas } from "../redux/actions/canvas";
import { AddHistory, UndoHistory, RedoHistory, EnableDispatch } from "../redux/actions/history";
import { SetCanvasStyling, UndoCanvasStyling, RedoCanvasStyling } from "../redux/actions/canvasStyling";
import {
    SetComponents,
    EditComponent,
    AddComponent,
    // EditComponents,
    PasteComponent,
    // DeleteComponent,
    UndoComponent,
    RedoComponent,
    UndoComponents,
    RedoComponents,
    UndoDeleteComponents,
    RedoDeleteComponents,
    UndoAddComponents,
    RedoAddComponents,
} from "../redux/actions/components";
import { KeyDown, KeyUp } from "../redux/actions/keyPress";
import { Canvas, History, Undo, Redo, KeyPress, CanvasStyling, Component } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";
import { canDispatch } from "../redux/reducers/history";
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
let action = "";
type Props = LayoutProps & LinkStateProps & LinkDispatchProps;
const Layout: React.FC<Props> = (props) => {
    const { canvas, keyPress, history, canvasStyling, components } = props;

    const classes = useStyles();
    const theme = useTheme();

    const PressingUndo = (): boolean => {
        return keyPress["z"] === true && keyPress["ctrl"] === true && !keyPress["y"];
    };

    const PressingRedo = (): boolean => {
        return !keyPress["z"] && keyPress["y"] && keyPress["ctrl"];
    };

    const PressingCTRL = (): boolean => {
        return keyPress["ctrl"] === true;
    };

    const IsUndoComponent = (undoArray): boolean => {
        let lastUndo = undoArray.length - 1;
        if (!undoArray[lastUndo]) {
            return false;
        }
        return undoArray[lastUndo].id;
    };

    const IsCanvasStyling = (undoArray): boolean => {
        let lastUndo = undoArray.length - 1;
        if (!undoArray[lastUndo]) {
            return false;
        }
        console.log(undoArray);
        return undoArray[lastUndo].fontSize;
    };

    const IsUndoComponentArray = (undoArray): boolean => {
        let lastUndo = undoArray.length - 1;
        if (!undoArray[lastUndo]) {
            return false;
        }
        return undoArray[lastUndo].comp;
    };

    const GetUndoComponent = (components, undoArray): Component => {
        let lastUndo = undoArray.length - 1;
        let componentArray = components.filter((comp) => comp.id === undoArray[lastUndo].id);
        return componentArray[0];
    };

    const UndoLastComponent = (storeComponents, undoArray): void => {
        let selectedComponent = GetUndoComponent(storeComponents, undoArray);
        if (action === "undo") {
            props.UndoComponent(undoArray);
            props.UndoHistory(selectedComponent);
            return;
        }
        props.RedoComponent(undoArray);
        props.RedoHistory(selectedComponent);
    };

    const UndoLastComponentArray = (storeComponents, undoRedoArray): void => {
        let lastUndo = undoRedoArray.length - 1;
        let previousComponentArray = undoRedoArray[lastUndo].comp;
        let componentDifferential = 0;
        if (storeComponents.length < previousComponentArray.length) {
            componentDifferential = 1;
        }
        if (storeComponents > previousComponentArray.length) {
            componentDifferential = -1;
        }
        if (action === "undo") {
            if (componentDifferential === 1) {
                props.UndoDeleteComponents([...previousComponentArray]);
                props.UndoHistory(storeComponents);
                return;
            }
            if (componentDifferential === -1) {
                props.UndoAddComponents([...previousComponentArray]);
                props.UndoHistory(storeComponents);
                return;
            }
            props.UndoComponents([...previousComponentArray]);
            props.UndoHistory(storeComponents);
            return;
        } else if (action === "redo") {
            if (componentDifferential === 1) {
                props.RedoDeleteComponents([...previousComponentArray]);
                props.RedoHistory(storeComponents);
                return;
            }
            if (componentDifferential === -1) {
                props.RedoAddComponents([...previousComponentArray]);
                props.RedoHistory(storeComponents);
                return;
            }
            props.RedoComponents([...previousComponentArray]);
            props.RedoHistory(storeComponents);
            return;
        }
    };

    const UndoLastCanvasStyling = (storeCanvasStyling, undoArray): void => {
        let lastUndo = undoArray.length - 1;
        let newCanvasStyling = { ...undoArray[lastUndo] };
        if (action === "undo") {
            props.UndoCanvasStyling(newCanvasStyling);
            props.UndoHistory(storeCanvasStyling);
            return;
        }
        props.RedoCanvasStyling(newCanvasStyling);
        props.RedoHistory(storeCanvasStyling);
    };

    React.useEffect(() => {
        window.addEventListener("keydown", (event) => {
            if (!keyPress[event.keyCode] || keyPress[event.keyCode] === false) {
                props.KeyDown(event.keyCode);
            }
            if (PressingCTRL()) {
                event.preventDefault();
            }
            if (PressingUndo() && canDispatch && history.undo.length > 0) {
                action = "undo";
                let newUndo = store.getState().history.undo;
                let storeComponents = store.getState().components;
                let storeCanvasStyling = store.getState().canvasStyling;
                if (IsUndoComponent(newUndo)) {
                    UndoLastComponent(storeComponents, newUndo);
                    return;
                }
                if (IsUndoComponentArray(newUndo)) {
                    UndoLastComponentArray(storeComponents, newUndo);
                    return;
                }
                if (IsCanvasStyling(newUndo)) {
                    UndoLastCanvasStyling(storeCanvasStyling, newUndo);
                    return;
                }
            }
            if (PressingRedo() && canDispatch && history.redo.length > 0) {
                action = "redo";
                let newRedo = store.getState().history.redo;
                let storeComponents = store.getState().components;
                let storeCanvasStyling = store.getState().canvasStyling;
                if (IsUndoComponent(newRedo)) {
                    UndoLastComponent(storeComponents, newRedo);
                    return;
                }
                if (IsUndoComponentArray(newRedo)) {
                    UndoLastComponentArray(storeComponents, newRedo);
                    return;
                }
                if (IsCanvasStyling(newRedo)) {
                    UndoLastCanvasStyling(storeCanvasStyling, newRedo);
                    return;
                }
            }
        });
        window.addEventListener("keyup", (event) => {
            props.KeyUp(event.keyCode);
            props.EnableDispatch();
            event.preventDefault();
        });
    }, [components, history]);

    const renderComponents = (): JSX.Element => {
        return (
            <div className={classes.root}>
                <ComponentLayers />
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
    UndoHistory: (undo: Undo) => void;
    RedoHistory: (undo: Undo) => void;
    EnableDispatch: () => void;
    SetCanvasStyling: (canvasStyling: CanvasStyling) => void;
    UndoCanvasStyling: (canvasStyling: CanvasStyling) => void;
    RedoCanvasStyling: (canvasStyling: CanvasStyling) => void;
    SetComponents: (components: Component[]) => void;
    AddComponent: (component: Component) => void;
    EditComponent: (component: Component) => void;
    UndoComponent: (undo: Undo[]) => void;
    RedoComponent: (redo: Redo[]) => void;
    UndoComponents: (undo: Undo[]) => void;
    RedoComponents: (redo: Redo[]) => void;
    UndoDeleteComponents: (undo: Undo[]) => void;
    RedoDeleteComponents: (redo: Redo[]) => void;
    UndoAddComponents: (undo: Undo[]) => void;
    RedoAddComponents: (redo: Redo[]) => void;
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
    UndoCanvasStyling: bindActionCreators(UndoCanvasStyling, dispatch),
    RedoCanvasStyling: bindActionCreators(RedoCanvasStyling, dispatch),
    SetComponents: bindActionCreators(SetComponents, dispatch),
    AddComponent: bindActionCreators(AddComponent, dispatch),
    EditComponent: bindActionCreators(EditComponent, dispatch),
    UndoComponent: bindActionCreators(UndoComponent, dispatch),
    RedoComponent: bindActionCreators(RedoComponent, dispatch),
    UndoComponents: bindActionCreators(UndoComponents, dispatch),
    RedoComponents: bindActionCreators(RedoComponents, dispatch),
    UndoDeleteComponents: bindActionCreators(UndoDeleteComponents, dispatch),
    RedoDeleteComponents: bindActionCreators(RedoDeleteComponents, dispatch),
    UndoAddComponents: bindActionCreators(UndoAddComponents, dispatch),
    RedoAddComponents: bindActionCreators(RedoAddComponents, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
