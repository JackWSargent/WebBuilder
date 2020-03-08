import * as React from "react";
/* eslint-disable */
import "./App.css";
import Layer from "./components/layer";
import Canvas from "./components/canvas";
import { Provider } from "react-redux";
import { store } from "./redux/store/storeConfiguration";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles
} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

const App: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();

  /* eslint-enable */
  return (
    <Provider store={store}>
      <div className="App">
        <Layer></Layer>
      </div>
    </Provider>
  );
};

export default App;
// app --> layers(map to a layer component)
// layer + canvas
