import * as React from "react";
/* eslint-disable */

import clsx from "clsx";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
// import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import { connect } from "react-redux";
import { startSetComponents } from "../redux/actions/components";
import { CanvasStyling } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { Dispatch, bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";
import { TextField } from "@material-ui/core";
import { startSetCanvasStyling } from "../redux/actions/canvasStyling";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: 200,
        color: "#fff"
      }
    },
    textField: {
      color: "#fff"
    }
  })
);
interface CanvasStylingProps {}

type Props = CanvasStylingProps & LinkStateProps & LinkDispatchProps;
const CanvasStyle: React.FC<Props> = props => {
  const { canvasStyling } = props;
  const classes = useStyles();
  const [fontSize, setFontSize] = React.useState(canvasStyling[0].fontSize);
  const [boxSizing, setBoxSizing] = React.useState(canvasStyling[0].boxSizing);
  const handleFontSizeChange = e => {
    setFontSize(e.target.value);
  };
  const handleBoxSizingChange = e => {
    setBoxSizing(e.target.value);
  };

  const handleApplyChanges = e => {
    onSet([{ fontSize, boxSizing }]);
  };
  const onSet = (canvasStyling: CanvasStyling[]) => {
    props.startSetCanvasStyling(canvasStyling);
    console.log(canvasStyling);
  };
  React.useEffect(() => {});
  return (
    <div className="app">
      <Grid container>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            noWrap
            style={{
              lineHeight: "64px",
              alignContent: "center",
              justifyContent: "center"
            }}
          >
            Canvas Styling
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <TextField
            id="fontSizeControl"
            label="Font Size"
            variant="outlined"
            type="number"
            defaultValue={fontSize}
            onChange={e => handleFontSizeChange(e)}
            inputProps={{ style: { color: "#fff", borderColor: "#fff" } }}
            className={classes.textField}
            InputLabelProps={{
              style: {
                color: "#fff !important",
                borderColor: "#fff"
              }
            }}
            InputProps={{
              style: { color: "#fff !important", borderColor: "#fff" }
            }}
          ></TextField>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
      <Grid container>
        <Grid item xs={1}></Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle1" noWrap style={{ lineHeight: "64px" }}>
            Box Sizing
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Select
            native
            onChange={e => handleBoxSizingChange(e)}
            inputProps={{}}
            defaultValue={"border-box"}
            style={{
              justifyContent: "center",
              alignContent: "center",
              marginTop: 15,
              marginLeft: 10
            }}
          >
            <option value={"border-box"}>Border-Box</option>
            <option value={"content-box"}>Content-Box</option>
          </Select>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleApplyChanges}
        style={{
          marginBottom: 50,
          fontSize: 20,
          color: "#fff",
          backgroundColor: "grey"
        }}
      >
        Apply Changes
      </Button>
    </div>
  );
};
interface LinkStateProps {
  canvasStyling: CanvasStyling[];
}

const mapStateToProps = (
  state: AppState,
  ownProps: CanvasStylingProps
): LinkStateProps => ({
  canvasStyling: state.canvasStyling
});

interface LinkDispatchProps {
  startSetCanvasStyling: (canvasStyling: CanvasStyling[]) => void;
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownProps: CanvasStylingProps
): LinkDispatchProps => ({
  startSetCanvasStyling: bindActionCreators(startSetCanvasStyling, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CanvasStyle);
