import * as React from "react";
/* eslint-disable */
import "./App.css";
import Layer from "./components/layer";
import CanvasDisplay from "./components/canvas";
import { Provider } from "react-redux";
import { store } from "./redux/store/storeConfiguration";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
  ThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";
import { connect } from "react-redux";
import { startSetCanvas } from "./redux/actions/canvas";
import { Canvas } from "./redux/types/actions";
import { AppState } from "./redux/store/storeConfiguration";
import { Dispatch, bindActionCreators } from "redux";
import { AppActions } from "./redux/types/actions";
import { ThunkDispatch } from "redux-thunk";
import { TextField } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

const App: React.FC = () => {
  const classes = useStyles();
  const theme = createMuiTheme({
    palette: {
      type: "dark",
      primary: {
        main: "#fff"
      },
      secondary: {
        main: "rgba(255,255,255, 0.7)"
      }
    }
  });

  /* eslint-enable */
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Layer></Layer>
        <CanvasDisplay />
      </Provider>
    </ThemeProvider>
  );
};

export default App;
// app --> layers(map to a layer component)
// layer + canvas
