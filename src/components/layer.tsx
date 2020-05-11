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
import { SetComponents, DeleteComponent, EditComponent } from "../redux/actions/components";
// import { DeleteComponent } from "../redux/actions/component";
import { SetCanvas, EditCanvas } from "../redux/actions/canvas";
import { Component, Canvas } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";
import ClearIcon from "@material-ui/icons/Clear";
import WebIcon from "@material-ui/icons/Web";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
            // width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            // width: drawerWidth,
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
        layer: {
            paddingTop: 0,
            paddingBottom: 0,
        },
        layerSelected: {
            paddingTop: 0,
            paddingBottom: 0,
            backgroundColor: "#5e697c",
        },
        divider: {
            backgroundColor: "#fff",
        },
        marginNS: {
            marginTop: "100%",
            width: 400,
            height: "100%",
            backgroundColor: "#fff",
            zIndex: 1000,
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: 600,
        },
        details: {
            padding: 0,
        },
    })
);
interface LayerProps {}

let selected: Array<number> = [];
let deleteChange: boolean = false;

type Props = LayerProps & LinkStateProps & LinkDispatchProps;

let changed: boolean = true;
let ctrl: boolean = false;

let open: boolean = true;

const Layer: React.FC<Props> = (props) => {
    const { components, canvas } = props;

    const classes = useStyles();
    const theme = useTheme();
    const [layers, setLayers] = React.useState(components);
    const [layersOpen, setLayersOpen] = React.useState(true);

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
        props.DeleteComponent(deletedComponent);
    };

    const handleSelectedState = (id) => {
        changed = true;
        let newLayers = layers.map((layer) => {
            if (layer.id === id) {
                if (!layer.selected && !selected.includes(layer.id)) {
                    if (ctrl) {
                        let newSelected = layer.id;
                        selected.push(newSelected);
                    } else {
                        selected.splice(0, selected.length);
                        selected.push(id);
                    }
                    return {
                        ...layer,
                        selected: true,
                    };
                } else if (selected.includes(layer.id) || layer.selected) {
                    if (ctrl) {
                        let idx = selected.indexOf(layer.id);
                        selected.splice(idx, 1);
                    } else {
                        let idx = selected.indexOf(id);
                        selected.splice(0, selected.length);
                    }

                    return {
                        ...layer,
                        selected: false,
                    };
                } else {
                    let idx = selected.indexOf(id);
                    selected.splice(idx, 1);
                    return { ...layer, selected: false };
                }
            }
            if (ctrl) {
                return layer;
            } else if (selected.includes(layer.id) && !ctrl) {
                console.log(layer.id);
                return { ...layer, selected: false };
            }

            return { ...layer, selected: false };
        });
        // console.log(newLayers);
        if (!deleteChange) {
            props.SetComponents(newLayers);
            setLayers(newLayers);
        }
    };

    const createLayers = (layers) => {
        let layersArray = layers.map((layer) => {
            return layer;
        });
        return layersArray;
    };

    const renderLayers = () => {
        let layersArray = createLayers(layers);
        if (layersArray) {
            return layersArray.map((layer) => {
                return (
                    <div key={layer.id}>
                        <Grid container onClick={() => handleSelectedState(layer.id)}>
                            <ListItem
                                button
                                className={clsx(classes.layer, {
                                    [classes.layerSelected]: selected.includes(layer.id),
                                })}
                                divider={true}>
                                <div style={{ marginLeft: 10 * layer.nestedLevel }}></div>

                                <Typography
                                    variant="subtitle2"
                                    component="div"
                                    align="center"
                                    style={{
                                        color: "#fff",
                                        fontSize: "1.15rem",
                                    }}>
                                    {layer.name}
                                </Typography>

                                {renderCanvasIcon(layer.type)}
                                {renderDelete(layer)}
                            </ListItem>
                        </Grid>
                    </div>
                );
            });
        } else {
            console.log("missing layers");
        }
    };

    React.useEffect(() => {
        window.addEventListener("keydown", (event) => {
            if (event.keyCode === 17) {
                ctrl = true;
            }
        });
        window.addEventListener("keyup", (event) => {
            if (event.keyCode === 17) {
                ctrl = false;
            }
        });
        changed = false;
        deleteChange = false;
    }, [event, changed, selected, canvas, open, layers]);

    React.useEffect(() => {
        if (layers.length !== components.length || layers !== components) {
            setLayers(components);
        }
    }, [components, layersOpen]);

    const handleExpand = () => {
        setLayersOpen(!layersOpen);
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
                        expanded={layersOpen}
                        style={{ marginTop: 0, marginBottom: 0, borderTop: "1px solid rgba(255, 255, 255, 0.12)" }}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            style={{ backgroundColor: "#2e2e2e" }}
                            onClick={handleExpand}>
                            <Typography className={classes.heading}>Explorer</Typography>
                        </ExpansionPanelSummary>
                        {renderLayers()}
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
}

interface LinkDispatchProps {
    DeleteComponent: (component: Component) => void;
    SetComponents: (components: Component[]) => void;
    SetCanvas: (canvas: Canvas) => void;
    EditComponent: (component: Component) => void;
    EditCanvas: (canvas: Canvas) => void;
}

const mapStateToProps = (state: AppState, ownProps: LayerProps): LinkStateProps => ({
    components: state.components,
    canvas: state.canvas,
});

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: LayerProps
): LinkDispatchProps => ({
    DeleteComponent: bindActionCreators(DeleteComponent, dispatch),
    SetComponents: bindActionCreators(SetComponents, dispatch),
    SetCanvas: bindActionCreators(SetCanvas, dispatch),
    EditComponent: bindActionCreators(EditComponent, dispatch),
    EditCanvas: bindActionCreators(EditCanvas, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layer);
