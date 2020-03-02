import * as React from "react";

/* eslint-disable */
import "./App.css";
// import Layer from "./components/layer";
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
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";

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
    divider: {
      backgroundColor: "#fff"
    }
  })
);

const App: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [layers, setLayers] = React.useState([
    {
      id: 100,
      name: "Container",
      type: "div",
      active: true,
      children: [300],
      parent: null,
      nestedLevel: 0,
      row: 0
    },
    {
      id: 200,
      name: "Container",
      type: "div",
      active: true,
      children: null,
      parent: null,
      nestedLevel: 0,
      row: 1
    },
    {
      id: 300,
      name: "Container",
      type: "div",
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
      active: true,
      children: null,
      parent: 300,
      nestedLevel: 2,
      row: 0
    }
  ]);
  const [open, setOpen] = React.useState(false);

  const handleActiveChange = id => {
    // TODO: make work with nested components
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

  let hasMoreChildren = false;
  let hasMoreSiblings = true;
  let currentLayerIndex = 0;

  /*
  check has more children

  Check for a child{
    push child
    run function with new child index starting
  } else {
    set moreChildren to false
  }


  */

  const runDownNestedLayers = (
    row: number,
    currentLayerIndex: number,
    layersArray: Array<any>,
    newArray: Array<any>,
    hasMoreChildren: boolean
  ): Array<any> => {
    // console.log(
    //   "row: " +
    //     row +
    //     " CurrentlayerIndex: " +
    //     currentLayerIndex +
    //     " layersArray.length: " +
    //     layersArray.length +
    //     " newArray length: " +
    //     newArray.length +
    //     " hasMoreChildren: " +
    //     hasMoreChildren
    // );
    if (
      layersArray[currentLayerIndex].children &&
      layersArray[currentLayerIndex].row == row
      // !newArray.includes(layersArray[currentLayerIndex])
    ) {
      // console.log("found child");
      let child = layersArray.filter(
        layer => layersArray[currentLayerIndex].children[0] == layer.id
      );
      child = child[0];
      currentLayerIndex = layersArray.indexOf(child);
      newArray.push(child);
    } else {
      // console.log("could not find child to push");
    }

    if (layersArray[currentLayerIndex].children == null) {
      // console.log("Setting has more children false");
      hasMoreChildren = false;
      return newArray;
    } else {
      hasMoreChildren = true;
      console.log("running again");
      runDownNestedLayers(
        row,
        currentLayerIndex,
        layersArray,
        newArray,
        hasMoreChildren
      );
    }

    // return newArray;
  };

  const buildLayerOrder = layersArray => {
    let areMoreComponents = true;
    let newArray = [];

    /* First Step
    1: Rendering the first root layer 
      - Row 0
      - Not inside newArray
      - Cannot have a parent
      Push layer to newArray
      (False) return
    2: Check for a child
      - Row 0
      - Not inside newArray
      - Has parent of root layer (Optional)
      Push layer to newArray
      (False) Attempt to render the next root layer if possible || return
    3: Continue checking for children (Run as many times as possible)
      - Row 0 
      - Not inside newArray
      - Has parent of layer previously put inside of newArray (Optional)
      Push layer to newArray
      (False) Attempt to render the next sibling layer if possible || return
    */
    for (let i = 0; areMoreComponents; i++) {
      if (!layersArray[i]) {
        areMoreComponents = false;
        // console.log("returning new array");
        return newArray;
      }
      let current = i;

      // if(!runDownNestedLayers(layersArray, newArray)){
      //   return newArray;
      // }
      // console.log(newArray);
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
        // if (
        //   layersArray[i].children !== null &&
        //   layersArray[i].children.length > 0
        // ) {
        //   for (let d = 0; d < layersArray[i].children.length; d++) {
        //     let child = layersArray.filter(
        //       layer => layersArray[i].children[d] == layer.id
        //     );
        //     newArray.push(child[0]);
        //   }
        // }
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
    // console.log(layersArray);
    if (layersArray) {
      return layersArray.map(layer => {
        return (
          <ListItem button key={layer.id} className={classes.layer}>
            <div style={{ marginLeft: 12 * layer.nestedLevel }}></div>
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
            >
              {layer.name}
            </Typography>
          </ListItem>
        );
      });
    } else {
      console.log("missing layers array");
    }
  };
  React.useEffect(() => {}, []);

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

export default App;
// app --> layers(map to a layer component)
// layer + canvas
