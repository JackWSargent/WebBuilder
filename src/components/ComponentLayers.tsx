import * as React from "react";
/* eslint-disable */
import "../App.css";
import clsx from "clsx";
import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
// import CheckBoxIcon from "@material-ui/icons/CheckBox";
// import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CanvasStyle from "./CanvasStyle";
import NewComponent from "./AddComponent";
import EditComponentTab from "./EditComponent";
import { connect } from "react-redux";
import { SetComponents, DeleteComponent, EditComponent, EditComponents } from "../redux/actions/components";
import { SetCanvas, EditCanvas } from "../redux/actions/canvas";
import { AddHistory } from "../redux/actions/history";
import { Component, Canvas, History, KeyPress } from "../redux/types/actions";
import { AppState, store } from "../redux/store/storeConfiguration";
import { bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";
import ClearIcon from "@material-ui/icons/Clear";
import WebIcon from "@material-ui/icons/Web";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { BuildComponentOrder } from "../redux/reducers/component";

let drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        rootClosed: {
            display: "flex",
            backgroundColor: "#666666",
            color: "#fff",
        },
        rootOpen: {
            display: "flex",
            backgroundColor: "#666666",
            color: "#fff",
        },
        appBar: {
            transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: "none",
        },
        drawer: {
            flexShrink: 0,
        },
        drawerPaper: {
            backgroundColor: "#666666",
            color: "#fff",
        },
        drawerHeader: {
            display: "flex",
            alignItems: "center",
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
            justifyContent: "flex-end",
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
        icon: {
            color: "#fff",
        },
        component: {
            paddingTop: 0,
            paddingBottom: 0,
        },
        componentSelected: {
            paddingTop: 0,
            paddingBottom: 0,
            backgroundColor: "#5e697c",
        },
        divider: {
            backgroundColor: "#fff",
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: 600,
        },
    })
);
interface ComponentLayersProps {}

let selected: Array<number> = [];
let deleteChange: boolean = false;
type Props = ComponentLayersProps & LinkStateProps & LinkDispatchProps;
let deletedComp = {};
let changed: boolean = true;
let renderedComponents: JSX.Element[] = [];
let open: boolean = true;
let storeComponents = store.getState().components;
let oldComponents = store.getState().components.slice();

const ComponentLayers: React.FC<Props> = (props) => {
    const { components, canvas, history, keyPress } = props;

    const classes = useStyles();
    const theme = useTheme();
    const [stateComponents, setStateComponents] = React.useState(components);
    const [menuOpen, setMenuOpen] = React.useState(true);

    const renderDelete = (deletedComponent) => {
        if (deletedComponent.type === "canvas") {
            return;
        }
        return <ClearIcon style={{ color: "#fff" }} onClick={() => handleDeleteChange(deletedComponent)} />;
    };

    const renderCanvasIcon = (type) => {
        if (type === "canvas") {
            return <WebIcon style={{ color: "#fff" }} fontSize="small" />;
        }
    };

    const handleDeleteChange = (deletedComponent) => {
        if (deletedComponent.type === "canvas") {
            return;
        }
        deleteChange = true;
        changed = true;
        console.log(stateComponents);
        props.AddHistory({ undo: store.getState().components });
        // props.DeleteComponent(deletedComponent);
    };

    React.useEffect(() => {
        changed = false;
        deleteChange = false;
    }, [event, changed, selected, canvas, open, stateComponents, keyPress]);

    const handleSelectedState = (id) => {
        changed = true;
        let ctrl: boolean = keyPress["ctrl"] ? keyPress["ctrl"] : false;
        let newComponents: Component[] = storeComponents.map((component) => {
            // If keyPress.ctrl, can just use edit component, if none selected use edit component, else use edit components because it is modify 2 or more components.
            if (component.id === id) {
                //Not selected and not inside the selected array
                if (!component.selected && !selected.includes(component.id)) {
                    if (ctrl) {
                        let newSelected = component.id;
                        selected.push(newSelected);
                    } else {
                        selected.splice(0, selected.length);
                        selected.push(id);
                    }
                    return {
                        ...component,
                        selected: true,
                    };
                    //Already Selected
                } else if (selected.includes(component.id) || component.selected) {
                    if (ctrl) {
                        let idx = selected.indexOf(component.id);
                        selected.splice(idx, 1);
                    } else {
                        // let idx = selected.indexOf(id);
                        selected.splice(0, selected.length);
                    }
                    return {
                        ...component,
                        selected: false,
                    };
                    //Already Selected
                } else {
                    let idx = selected.indexOf(id);
                    selected.splice(idx, 1);
                    return { ...component, selected: false };
                }
            }
            if (ctrl) {
                return component;
            } else if (selected.includes(component.id) && !ctrl) {
                return { ...component, selected: false };
            }

            return { ...component, selected: false };
        });
        if (!deleteChange) {
            newComponents = BuildComponentOrder(newComponents);
            props.AddHistory({ undo: storeComponents });
            props.SetComponents(newComponents);
            setStateComponents(newComponents);
        }
    };

    const RenderComponentLayers = (componentArray) => {
        if (componentArray) {
            renderedComponents = componentArray.map((component) => {
                return (
                    <div key={component.id}>
                        <Grid container onClick={() => handleSelectedState(component.id)}>
                            <ListItem
                                button
                                className={clsx(classes.component, {
                                    [classes.componentSelected]: component.selected,
                                })}
                                divider={true}>
                                <div style={{ marginLeft: 10 * component.nestedLevel }}></div>

                                <Typography
                                    variant="subtitle2"
                                    component="div"
                                    align="center"
                                    style={{
                                        color: "#fff",
                                        fontSize: "1.15rem",
                                    }}>
                                    {component.name}
                                </Typography>

                                {renderCanvasIcon(component.type)}
                                {renderDelete(component)}
                            </ListItem>
                        </Grid>
                    </div>
                );
            });
        } else {
            console.log("missing state components");
        }
    };

    React.useEffect(() => {
        if (stateComponents.length !== components.length || stateComponents !== components) {
            setStateComponents(components);
            renderedComponents = [];
            reRenderComponents();
        }
    }, [components, menuOpen, history]);

    const handleExpand = () => {
        setMenuOpen(!menuOpen);
    };

    const handleDrawerOpen = () => {
        open = true;
        props.EditCanvas({
            drawerOpen: true,
        });
    };

    const handleDrawerClose = () => {
        open = false;
        props.EditCanvas({
            drawerOpen: false,
        });
    };

    const reRenderComponents = () => {
        renderedComponents = [];
        RenderComponentLayers(stateComponents);
        return renderedComponents;
    };

    /* eslint-enable */
    return (
        <div id="layers-component">
            <div
                className={clsx(classes.rootClosed, {
                    [classes.rootOpen]: open,
                })}
                style={{
                    backgroundColor: "#666666",
                    color: "#fff",
                    height: 64,
                }}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}>
                    <Toolbar style={{ backgroundColor: "#666666", color: "#fff" }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, open && classes.hide)}
                            style={{ zIndex: 1300 }}>
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}>
                    <Grid container style={{ width: canvas.drawerLeftMargin }}>
                        <Grid item xs={8}></Grid>
                        <Grid item xs={4}>
                            <div className={classes.drawerHeader}>
                                <IconButton className={classes.icon} onClick={handleDrawerClose}>
                                    {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                                </IconButton>
                            </div>
                        </Grid>
                    </Grid>

                    <ExpansionPanel
                        expanded={menuOpen}
                        style={{ marginTop: 0, marginBottom: 0, borderTop: "1px solid rgba(255, 255, 255, 0.12)" }}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            style={{ backgroundColor: "#2e2e2e" }}
                            onClick={handleExpand}>
                            <Typography className={classes.heading}>Explorer</Typography>
                        </ExpansionPanelSummary>
                        {reRenderComponents()}
                    </ExpansionPanel>

                    <CanvasStyle />
                    <NewComponent />
                </Drawer>

                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="right"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}>
                    <Grid container style={{ width: canvas.drawerLeftMargin }}>
                        <Grid item xs={8}>
                            <Typography variant="h6" noWrap style={{ lineHeight: "64px" }}>
                                Properties
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <div className={classes.drawerHeader}>
                                <IconButton className={classes.icon} onClick={handleDrawerClose}>
                                    {theme.direction === "ltr" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                                </IconButton>
                            </div>
                        </Grid>
                    </Grid>
                    <EditComponentTab />
                </Drawer>

                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: open,
                    })}>
                    <div className={classes.drawerHeader} />
                </main>
            </div>
        </div>
    );
};

interface LinkStateProps {
    components: Component[];
    canvas: Canvas;
    history: History;
    keyPress: KeyPress;
}

interface LinkDispatchProps {
    DeleteComponent: (component: Component) => void;
    SetComponents: (components: Component[]) => void;
    SetCanvas: (canvas: Canvas) => void;
    EditComponent: (component: Component) => void;
    EditComponents: (components: Component[]) => void;
    EditCanvas: (canvas: Canvas) => void;
    AddHistory: (history: History) => void;
}

const mapStateToProps = (state: AppState, ownProps: ComponentLayersProps): LinkStateProps => ({
    components: state.components,
    canvas: state.canvas,
    history: state.history,
    keyPress: state.keyPress,
});

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: ComponentLayersProps
): LinkDispatchProps => ({
    DeleteComponent: bindActionCreators(DeleteComponent, dispatch),
    SetComponents: bindActionCreators(SetComponents, dispatch),
    SetCanvas: bindActionCreators(SetCanvas, dispatch),
    EditComponent: bindActionCreators(EditComponent, dispatch),
    EditComponents: bindActionCreators(EditComponents, dispatch),
    EditCanvas: bindActionCreators(EditCanvas, dispatch),
    AddHistory: bindActionCreators(AddHistory, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ComponentLayers);
