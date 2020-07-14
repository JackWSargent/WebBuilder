import * as React from "react";
/* eslint-disable */
import "../App.css";
import ComponentLayers from "./ComponentLayers";
import CanvasDisplay from "./Canvas";
import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { SetCanvas } from "../redux/actions/canvas";
import { AddHistory, UndoHistory, RedoHistory, EnableDispatch } from "../redux/actions/history";
import { SetCanvasStyling, UndoCanvasStyling } from "../redux/actions/canvasStyling";
import {
    SetComponents,
    EditComponent,
    AddComponent,
    // EditComponents,
    PasteComponent,
    // DeleteComponent,
    UndoComponent,
    UndoComponents,
    UndoDeleteComponents,
    UndoAddComponents,
    RedoComponent,
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
        props.UndoComponent(undoArray);
        props.UndoHistory(selectedComponent);
    };

    const UndoLastComponentArray = (storeComponents, undoArray): void => {
        let lastUndo = undoArray.length - 1;
        let undoneComponentArr = undoArray[lastUndo].comp;
        let componentDifferential = 0;
        if (storeComponents.length < undoneComponentArr.length) {
            componentDifferential = 1;
        }
        if (storeComponents > undoneComponentArr.length) {
            componentDifferential = -1;
        }
        if (componentDifferential === 1) {
            props.UndoDeleteComponents([...undoneComponentArr]);
            props.UndoHistory(storeComponents);
            return;
        }
        if (componentDifferential === -1) {
            props.UndoAddComponents([...undoneComponentArr]);
            props.UndoHistory(storeComponents);
            return;
        }
        props.UndoComponents([...undoneComponentArr]);
        props.UndoHistory(storeComponents);
    };

    const UndoLastCanvasStyling = (storeCanvasStyling, undoArray): void => {
        let lastUndo = undoArray.length - 1;
        let newCanvasStyling = { ...undoArray[lastUndo] };
        props.UndoCanvasStyling(newCanvasStyling);
        props.UndoHistory(storeCanvasStyling);
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
                // If latest action was done on a component
                let newUndo = store.getState().history.undo;
                let storeComponents = store.getState().components;
                let storeCanvasStyling = store.getState().canvasStyling;
                if (IsUndoComponent(newUndo)) {
                    UndoLastComponent(storeComponents, newUndo);
                }
                if (IsUndoComponentArray(newUndo)) {
                    UndoLastComponentArray(storeComponents, newUndo);
                }
                if (IsCanvasStyling(newUndo)) {
                    UndoLastCanvasStyling(storeCanvasStyling, newUndo);
                }
            }
            if (PressingRedo() && canDispatch && history.redo.length > 0) {
                let newRedo = store.getState().history.redo;
                let storeComponents = store.getState().components;
                if (newRedo[newRedo.length - 1].id) {
                    let component = storeComponents.filter((comp) => comp.id === newRedo[newRedo.length - 1].id);
                    let selectedComponent = component[0];
                    props.RedoComponent(newRedo);
                    props.RedoHistory(selectedComponent);
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
    UndoHistory: (redo: Redo) => void;
    RedoHistory: (undo: Undo) => void;
    EnableDispatch: () => void;
    SetCanvasStyling: (canvasStyling: CanvasStyling) => void;
    UndoCanvasStyling: (canvasStyling: CanvasStyling) => void;
    SetComponents: (components: Component[]) => void;
    AddComponent: (component: Component) => void;
    EditComponent: (component: Component) => void;
    UndoComponent: (undo: Undo[]) => void;
    UndoComponents: (undo: Undo[]) => void;
    UndoDeleteComponents: (undo: Undo[]) => void;
    UndoAddComponents: (undo: Undo[]) => void;
    RedoComponent: (redo: Redo[]) => void;
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
    SetComponents: bindActionCreators(SetComponents, dispatch),
    AddComponent: bindActionCreators(AddComponent, dispatch),
    EditComponent: bindActionCreators(EditComponent, dispatch),
    UndoComponent: bindActionCreators(UndoComponent, dispatch),
    UndoComponents: bindActionCreators(UndoComponents, dispatch),
    UndoDeleteComponents: bindActionCreators(UndoDeleteComponents, dispatch),
    UndoAddComponents: bindActionCreators(UndoAddComponents, dispatch),
    RedoComponent: bindActionCreators(RedoComponent, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
