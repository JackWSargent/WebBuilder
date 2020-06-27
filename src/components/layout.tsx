import * as React from "react";
/* eslint-disable */
import "../App.css";
import Layer from "./Layer";
import CanvasDisplay from "./Canvas";
import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { SetCanvas } from "../redux/actions/canvas";
import { UndoHistory, RedoHistory, EnableDispatch } from "../redux/actions/history";
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
import { canDispatch } from "../redux/reducers/history";

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
        return keyPress["z"] === true && keyPress["ctrl"] === true && !keyPress["y"] ? true : false;
    };

    const PressingRedo = (): boolean => {
        return keyPress["z"] === false && keyPress["y"] && keyPress["ctrl"] ? true : false;
    };

    const PressingCTRL = (): boolean => {
        return keyPress["ctrl"] === true ? true : false;
    };

    const UndoComponent = () => {
        console.log(components, "Original Components");
        let currentComponent = components.filter((el) => el.id === history.undo[history.undo.length - 1].id);
        // Last component on top of undo stack
        if (currentComponent) {
            console.log(currentComponent, "Current Component");

            let newComponents = components.map((comp) => {
                if (comp.id === history.undo[history.undo.length - 1].id) {
                    console.log({ ...history.undo[history.undo.length - 1] });
                    console.log("history undo", history.undo);
                    return { ...history.undo[history.undo.length - 1] };
                }
                return comp;
            });
            console.log("New Components", newComponents);
            console.log("length", history.undo.length);
            console.log("history undo", history.undo);
            props.SetComponents(newComponents);
            return;
        }
        let newComponents = components.map((comp) => {
            return comp;
        });
        newComponents.push(history.undo[history.undo.length - 1]);
        console.log("length", history.undo.length);
        console.log(newComponents);
        props.SetComponents(newComponents);
        return;
    };

    const Undo = () => {
        let EndOfArray = history.undo[history.undo.length - 1];
        if (EndOfArray.id !== null) {
            if (EndOfArray.type !== null) {
                UndoComponent();
                return;
            }
        }
    };
    //working on getting this to work when history is being watched and also not running it a million times and only once, probably by making sure that atleast z is false before enabling a new action on history to be dispatched,
    React.useEffect(() => {
        window.addEventListener("keydown", (event) => {
            if (!keyPress[event.keyCode] || keyPress[event.keyCode] === false) {
                // If keyPressed is false
                props.KeyDown(event.keyCode);
            }
            // Take away browsers abilities to mess with undo and redo
            if (PressingCTRL()) {
                event.preventDefault();
            }
            if (PressingUndo() && canDispatch && history.undo.length > 0) {
                Undo(); // Activates Undo
                props.UndoHistory();
            } else if (PressingRedo() && canDispatch && history.redo.length > 0) {
                props.RedoHistory();
            }
        });
        window.addEventListener("keyup", (event) => {
            props.KeyUp(event.keyCode);
            props.EnableDispatch();
            event.preventDefault();
        });
    }, [canvas.drawerOpen, keyPress, history, components]);

    const renderComponents = () => {
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
    UndoHistory: () => void;
    RedoHistory: () => void;
    EnableDispatch: () => void;
    SetCanvasStyling: (canvasStyling: CanvasStyling) => void;
    SetComponents: (components: Component[]) => void;
    AddComponent: (component: Component) => void;
    EditComponent: (component: Component) => void;
    PasteComponent: (id: number) => void;
    UndoComponent: () => void;
    RedoComponent: () => void;
}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: LayoutProps
): LinkDispatchProps => ({
    SetCanvas: bindActionCreators(SetCanvas, dispatch),
    KeyUp: bindActionCreators(KeyUp, dispatch),
    KeyDown: bindActionCreators(KeyDown, dispatch),
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
