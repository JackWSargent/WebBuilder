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
import CanvasStyle from "./canvasStyle";
import { connect } from "react-redux";
import { SetComponent } from "../redux/actions/component";
import { SetCanvas } from "../redux/actions/canvas";
import { Component, Canvas } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";
import ClearIcon from "@material-ui/icons/Clear";
import WebIcon from "@material-ui/icons/Web";

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
    })
);
interface LayerProps {}

type Props = LayerProps & LinkStateProps & LinkDispatchProps;

let changed: boolean = true;

const Layer: React.FC<Props> = (props) => {
    const { component, canvas } = props;

    const onSet = (component: Component[]) => {
        props.SetComponent(component);
    };

    const classes = useStyles();
    const theme = useTheme();
    const [selected, setSelected] = React.useState([]);
    const [layers, setLayers] = React.useState(component);
    const [open, setOpen] = React.useState(true);
    const [ctrl, setCtrl] = React.useState(false);

    const handleActiveChange = (id) => {
        console.log("changing active");
        // console.log("changing: " + id);
        const newLayers = layers.map((layer) => {
            // if this is the id we care about, change the last entry
            // if (layer.id === id) {
            //     // spread everything in layer and just change its active state
            //     return {
            //         ...layer,
            //         active: !layer.active
            //     };
            // } else {
            //     // otherwise, return the unaltered layer
            return layer;
            // }
        });
        // let indexesToIgnore = [];
        // for (let i = 0; i < newLayers.length; i++) {
        //     if (newLayers[i].id == id) {
        //         let layer = newLayers[i];
        //         if (layer.children !== null && layer.children.length > 0) {
        //             for (let k = 0; k < layer.children.length; k++) {
        //                 indexesToIgnore.push(layers.indexOf(layers[k + i]));
        //             }
        //             let canvasProperties = [
        //                 {
        //                     drawerClicked: canvas[0].drawerClicked,
        //                     drawerLeftMargin: canvas[0].drawerLeftMargin,
        //                     drawerOpen: canvas[0].drawerOpen,
        //                     idxIgnore: indexesToIgnore
        //                 }
        //             ];
        //             props.SetCanvas(canvasProperties);
        //             console.log(canvasProperties);
        //         }
        //     }
        // }

        setLayers(newLayers);
    };

    // const renderActive = (val, id) => {
    //     if (val === true) {
    //         return <CheckBoxIcon style={{ color: "#fff" }} onClick={() => handleActiveChange(id)} />;
    //     } else {
    //         return <CheckBoxOutlineBlankIcon onClick={() => handleActiveChange(id)} style={{ color: "#fff" }} />;
    //     }
    // };

    const renderDelete = (parent, id, children, type) => {
        if (type === "canvas") {
            return;
        }
        return <ClearIcon style={{ color: "#fff" }} onClick={() => handleDeleteChange(parent, id, children, type)} />;
    };

    const renderCanvasIcon = (type) => {
        if (type === "canvas") {
            return <WebIcon style={{ color: "#fff" }} fontSize="small" />;
        }
    };

    const handleDeleteChange = (parent, id, children, type) => {
        if (type === "canvas") {
            return;
        }
        console.log("changing deleted");
        changed = true;
        let newLayers = layers.map((layer) => {
            return layer;
        });

        let idx = newLayers.findIndex((layer) => layer.id == id);
        if (idx < 0) {
            console.log("idx doesnt exist");
            return;
        }

        let parentIdx = newLayers.findIndex((layer) => layer.id == parent);
        if (newLayers.length == 1 || idx === 0) {
            newLayers = [];
            console.log(newLayers);
            setLayers(newLayers);
            props.SetComponent(newLayers);
        }
        //Delete parent reference to child
        if (parent !== null) {
            let childIdx = newLayers[parentIdx].children.indexOf(id);
            console.log(newLayers);
            if (newLayers[parentIdx].children.length == 1) {
                newLayers = newLayers.map((layer) => {
                    if (layer.id === parent) {
                        // console.log("setting children null");
                        return {
                            ...layer,
                            children: null,
                        };
                    }
                    return layer;
                });
                // newLayers[parentIdx].children === null;
                // newLayers[parentIdx].children.splice(childIdx, 1);
            } else {
                newLayers[parentIdx].children.splice(childIdx, 1);
                // console.log("parent has more than 1 child");
                // console.log(newLayers);
            }
        }
        if (children !== null) {
            let numChildren = children.length;
            // console.log("num of children: " + numChildren + " starting idx: " + idx);
            newLayers.splice(idx + 1, numChildren);
        }
        // if (newLayers.length == 1) {
        //     newLayers = [];
        // } else {
        newLayers.splice(idx, 1);
        // }

        console.log(id);
        console.log(newLayers);

        // if (newLayers !== null && newLayers.length > 0) {
        //     console.log(newLayers);
        // }
        if (layers !== newLayers) {
            setLayers(newLayers);
            props.SetComponent(newLayers);
            // console.log("setting components");
        }
        // onSet(newLayers);
    };

    const handleSelectedState = (id) => {
        // console.log("changing selected");
        changed = true;
        let newLayers = layers.map((layer) => {
            // if this is the id we care about, change the last entry
            if (layer.id === id) {
                // spread everything in layer and just change its selected state
                if (!layer.selected) {
                    // Not Selected
                    if (ctrl) {
                        let newSelected = [layer.id];
                        newSelected = newSelected.concat(selected);
                        setSelected(newSelected);
                    } else {
                        let newSelected = [];
                        newSelected = newSelected.concat(layer.id);
                        setSelected(newSelected);
                    }
                } else if (layer.selected) {
                    //Already selected
                    if (ctrl) {
                        let idx = selected.indexOf(id);
                        let newSelected = selected;
                        newSelected.splice(idx, 1);
                        setSelected(newSelected);
                    } else if (selected.includes(selected.indexOf(id))) {
                        let idx = selected.indexOf(id);
                        let newSelected = selected;
                        newSelected.splice(idx, 1);
                        setSelected(newSelected);
                    } //
                }

                return {
                    ...layer,
                    selected: !layer.selected,
                };
            } else {
                // otherwise, return the unaltered layer
                // console.log("Returning unaltered layer");
                return layer;
            }
        });
        setLayers(newLayers);
    };

    const createLayers = (layers) => {
        let layersArray = layers.map((layer) => {
            return layer;
        });
        // onSet(layers);
        return layersArray;
    };

    const renderLayers = () => {
        let layersArray = createLayers(layers);
        if (layersArray) {
            return layersArray.map((layer) => {
                return (
                    <div key={layer.id}>
                        <Grid container>
                            <ListItem
                                button
                                className={clsx(classes.layer, {
                                    [classes.layerSelected]: selected.includes(layer.id),
                                })}
                                divider={true}>
                                <div style={{ marginLeft: 20 * layer.nestedLevel }}></div>
                                {/* {renderActive(layer.active, layer.id)} */}
                                <Typography
                                    variant="subtitle2"
                                    component="div"
                                    align="center"
                                    style={{
                                        color: "#fff",
                                        fontSize: "1.15rem",
                                    }}
                                    onClick={() => handleSelectedState(layer.id)}>
                                    {layer.name}-{layer.id}
                                </Typography>
                                {renderCanvasIcon(layer.type)}
                                {renderDelete(layer.parent, layer.id, layer.children, layer.type)}
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
                setCtrl(true);
                // console.log(true);
            }
        });
        window.addEventListener("keyup", (event) => {
            if (event.keyCode === 17) {
                setCtrl(false);
            }
        });
        changed = false;
    }, [event, changed, selected, canvas, open]);

    const handleDrawerOpen = () => {
        setOpen(true);
        props.SetCanvas([
            {
                drawerClicked: canvas[0].drawerClicked,
                drawerLeftMargin: canvas[0].drawerLeftMargin,
                drawerOpen: true,
                idxIgnore: canvas[0].idxIgnore,
            },
        ]);
    };

    const handleDrawerClose = () => {
        setOpen(false);
        props.SetCanvas([
            {
                drawerClicked: canvas[0].drawerClicked,
                drawerLeftMargin: canvas[0].drawerLeftMargin,
                drawerOpen: false,
                idxIgnore: canvas[0].idxIgnore,
            },
        ]);
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
                    <Grid container style={{ width: canvas[0].drawerLeftMargin }}>
                        <Grid item xs={8}>
                            <Typography variant="h6" noWrap style={{ lineHeight: "64px" }}>
                                Components
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <div className={classes.drawerHeader}>
                                <IconButton className={classes.icon} onClick={handleDrawerClose}>
                                    {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                                </IconButton>
                            </div>
                        </Grid>
                    </Grid>

                    <Divider className="Divider" />
                    {renderLayers()}
                    <Divider className="Divider" />
                    <CanvasStyle />
                    <Divider className="Divider" />
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
    component: Component[];
    canvas: Canvas[];
}

const mapStateToProps = (state: AppState, ownProps: LayerProps): LinkStateProps => ({
    component: state.component,
    canvas: state.canvas,
});

interface LinkDispatchProps {
    SetComponent: (component: Component[]) => void;
    SetCanvas: (canvas: Canvas[]) => void;
}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: LayerProps
): LinkDispatchProps => ({
    SetComponent: bindActionCreators(SetComponent, dispatch),
    SetCanvas: bindActionCreators(SetCanvas, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layer);
