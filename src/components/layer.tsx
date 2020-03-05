import * as React from "react";
/* eslint-disable */
import "../App.css";
import clsx from "clsx";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import { ListSubheader } from "@material-ui/core";

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      backgroundColor: "#282c34",
      color: "#fff"
    },
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    hide: {
      display: "none"
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: "#282c34",
      color: "#fff"
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      justifyContent: "flex-end"
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      marginLeft: -drawerWidth
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0
    },
    icon: {
      color: "#fff"
    },
    layer: {
      paddingTop: 0,
      paddingBottom: 0
    },
    layerSelected: {
      paddingTop: 0,
      paddingBottom: 0,
      backgroundColor: "#5e697c"
    },
    divider: {
      backgroundColor: "#fff"
    }
  })
);

const Layer: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [layersHasChanged, setLayersHasChanged] = React.useState(true);
  const [selected, setSelected] = React.useState([]);
  const [layers, setLayers] = React.useState([
    {
      id: 100,
      name: "Container",
      type: "div",
      selected: false,
      active: true,
      children: [300, 800],
      parent: null,
      nestedLevel: 0,
      row: 0
    },
    {
      id: 200,
      name: "Container",
      type: "div",
      selected: false,
      active: true,
      children: [500, 600],
      parent: null,
      nestedLevel: 0,
      row: 1
    },
    {
      id: 300,
      name: "Container",
      type: "div",
      selected: false,
      active: true,
      children: [400],
      parent: 100,
      nestedLevel: 1,
      row: 0
    },
    {
      id: 400,
      name: "Container",
      type: "div",
      selected: false,
      active: true,
      children: null,
      parent: 300,
      nestedLevel: 2,
      row: 0
    },
    {
      id: 500,
      name: "Container",
      type: "div",
      selected: false,
      active: true,
      children: null,
      parent: 200,
      nestedLevel: 1,
      row: 1
    },
    {
      id: 600,
      name: "Container",
      type: "div",
      selected: false,
      active: true,
      children: [700],
      parent: 200,
      nestedLevel: 1,
      row: 1
    },
    {
      id: 700,
      name: "Container",
      type: "div",
      selected: false,
      active: true,
      children: [900],
      parent: 600,
      nestedLevel: 2,
      row: 1
    },
    {
      id: 800,
      name: "Container",
      type: "div",
      selected: false,
      active: true,
      children: null,
      parent: 100,
      nestedLevel: 1,
      row: 0
    },
    {
      id: 900,
      name: "Container",
      type: "div",
      selected: false,
      active: true,
      children: null,
      parent: 700,
      nestedLevel: 3,
      row: 1
    }
  ]);
  const [open, setOpen] = React.useState(true);

  const handleActiveChange = id => {
    // console.log("changing: " + id);
    const newLayers = layers.map(layer => {
      // if this is the id we care about, change the last entry
      if (layer.id === id) {
        // spread everything in layer and just change its active state
        return {
          ...layer,
          active: !layer.active
        };
      } else {
        // otherwise, return the unaltered layer
        return layer;
      }
    });

    setLayers(newLayers);
  };

  const renderActive = (val, id) => {
    if (val === true) {
      return (
        <CheckBoxIcon
          style={{ color: "#fff" }}
          onClick={() => handleActiveChange(id)}
        />
      );
    } else {
      return (
        <CheckBoxOutlineBlankIcon
          onClick={() => handleActiveChange(id)}
          style={{ color: "#fff" }}
        />
      );
    }
  };

  const handleSelectedState = id => {
    const newLayers = layers.map(layer => {
      // if this is the id we care about, change the last entry
      if (layer.id === id) {
        // spread everything in layer and just change its selected state
        let currentLayer = layer;
        if (!layer.selected) {
          let newSelected = [layer.id];
          newSelected = newSelected.concat(selected);
          setSelected(newSelected);
        } else {
          let idx = selected.indexOf(id);
          let newSelected = selected;
          newSelected.splice(idx, 1);
          setSelected(newSelected);
          return {
            ...layer,
            selected: !layer.selected
          };
        }
        return {
          ...layer,
          selected: !layer.selected
        };
      } else {
        // otherwise, return the unaltered layer
        return layer;
      }
    });
    setLayers(newLayers);
  };

  let hasMoreChildren = false;
  let hasMoreSiblings = true;
  let currentLayerIndex = 0;

  const checkForSiblings = (
    row: number,
    currentLayerIndex: number,
    layersArray: Array<any>,
    newArray: Array<any>,
    hasMoreChildren: boolean
  ) => {
    // console.log(
    // "Checking for siblings. currentLayerIndex: " + currentLayerIndex
    // );
    for (let i = newArray.length - 2; i > -1; i--) {
      //Run backwards through the newArray and look at the parent starting from the bottom
      let currentNode = newArray[i];
      // console.log(currentNode);
      if (currentNode.children) {
        // console.log("Children");
        if (currentNode.children.length > 1) {
          // console.log("MoreChildren than 1");
          //If children is greater than 1 meaning that there could be potentially more children to render start loop looking through to see if they are included inside the newArray already
          for (let k = 1; k < currentNode.children.length; k++) {
            let currentChild = layersArray.filter(
              layer => currentNode.children[k] == layer.id
            );
            currentChild = currentChild[0];
            // console.log(currentChild);
            if (!newArray.includes(currentChild)) {
              // console.log("false : " + currentNode.children[k]);
              let child = layersArray.filter(
                layer => currentNode.children[k] == layer.id
              );
              child = child[0];
              currentLayerIndex = layersArray.indexOf(child);
              newArray.push(child);
              // console.log(newArray);
              // console.log(currentLayerIndex);
              if (layersArray[currentLayerIndex].children) {
                runDownNestedLayers(
                  row,
                  currentLayerIndex,
                  layersArray,
                  newArray,
                  hasMoreChildren
                );
              }
            } else {
              // console.log("true");
            }
          }
          hasMoreSiblings = false;
        }
      }
    }
  };

  const runDownNestedLayers = (
    row: number,
    currentLayerIndex: number,
    layersArray: Array<any>,
    newArray: Array<any>,
    hasMoreChildren: boolean
  ): Array<any> => {
    // console.log("CurrentLayerIndex: ");
    // console.log(currentLayerIndex);
    if (
      layersArray[currentLayerIndex].children &&
      layersArray[currentLayerIndex].row == row
      // newArray.includes(layersArray[currentLayerIndex])
    ) {
      let child = layersArray.filter(
        layer => layersArray[currentLayerIndex].children[0] == layer.id
      );
      child = child[0];
      currentLayerIndex = layersArray.indexOf(child);
      // console.log("Pushing: ");
      // console.log(child);
      newArray.push(child);
    } else {
      // console.log("Could not find child to push");
    }

    if (
      layersArray[currentLayerIndex].children == null &&
      layersArray.length !== newArray.length
    ) {
      // found the bottom of the barrel
      // && layersArray.length == newArray.length
      // console.log(currentLayerIndex);
      hasMoreChildren = false;
      checkForSiblings(
        row,
        currentLayerIndex,
        layersArray,
        newArray,
        hasMoreChildren
      );
    } else if (
      layersArray[currentLayerIndex].children == null &&
      layersArray.length == newArray.length
    ) {
      // console.log(newArray);
      return newArray;
    } else {
      hasMoreChildren = true;
      runDownNestedLayers(
        row,
        currentLayerIndex,
        layersArray,
        newArray,
        hasMoreChildren
      );
    }
  };

  const buildLayerOrder = layersArray => {
    let areMoreComponents = true;
    let newArray = [];
    for (let i = 0; areMoreComponents; i++) {
      if (!layersArray[i]) {
        areMoreComponents = false;
        return newArray;
      }
      let current = i;
      if (
        layersArray[i].row == i &&
        !newArray.includes(layersArray[i]) &&
        !layersArray.parent
      ) {
        newArray.push(layersArray[i]);
        newArray.concat(
          runDownNestedLayers(
            i,
            current,
            layersArray,
            newArray,
            hasMoreChildren
          )
        );
      } else {
        if (newArray.length == layersArray.length) {
          areMoreComponents = false;
        }
      }
    }
    return newArray;
  };

  const createLayers = layers => {
    let layersArray = layers.map(layer => {
      return layer;
    });
    return layersArray;
  };

  const renderLayers = () => {
    let layersArray = createLayers(layers);
    layersArray = buildLayerOrder(layersArray);
    if (layersArray) {
      return layersArray.map(layer => {
        return (
          <ListItem
            button
            key={layer.id}
            className={clsx(classes.layer, {
              [classes.layerSelected]: selected.includes(layer.id)
            })}
            divider={true}
          >
            <div style={{ marginLeft: 20 * layer.nestedLevel }}></div>
            {renderActive(layer.active, layer.id)}
            <Typography
              variant="subtitle2"
              component="div"
              align="center"
              style={{
                color: "#fff",
                marginTop: 0,
                fontSize: "1.15rem"
              }}
              onClick={() => handleSelectedState(layer.id)}
            >
              {layer.name}-{layer.id}
            </Typography>
          </ListItem>
        );
      });
    } else {
      console.log("missing layers");
    }
  };
  React.useEffect(() => {}, [layers, selected]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  /* eslint-enable */
  return (
    <div className="App">
      <div
        className={classes.root}
        style={{ backgroundColor: "#282c34", color: "#fff" }}
      >
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open
          })}
        >
          <Toolbar style={{ backgroundColor: "#282c34", color: "#fff" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Components
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton className={classes.icon} onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <Divider className="Divider" />
          {renderLayers()}
          <Divider className="Divider" />
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open
          })}
        >
          <div className={classes.drawerHeader} />
        </main>
      </div>
    </div>
  );
};

export default Layer;
// app --> layers(map to a layer component)
// layer + canvas