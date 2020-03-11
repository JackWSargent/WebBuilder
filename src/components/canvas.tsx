import * as React from "react";
import { connect } from "react-redux";
import { startSetCanvas } from "../redux/actions/canvas";
import { Canvas } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { Dispatch, bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";
import { TextField } from "@material-ui/core";
interface CanvasProps {}

type Props = CanvasProps & LinkStateProps & LinkDispatchProps;
const CanvasDisplay: React.FC<Props> = props => {
  const { canvas } = props;

  return (
    <div className="app">
      <div
        id="margin-resize"
        className="marginEW"
        style={{ cursor: "ew-resize", position: "absolute" }}
      >
        fdaf
      </div>
    </div>
  );
};
interface LinkStateProps {
  canvas: Canvas[];
}

const mapStateToProps = (
  state: AppState,
  ownProps: CanvasProps
): LinkStateProps => ({
  canvas: state.canvas
});

interface LinkDispatchProps {
  startSetCanvas: (canvas: Canvas[]) => void;
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownProps: CanvasProps
): LinkDispatchProps => ({
  startSetCanvas: bindActionCreators(startSetCanvas, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CanvasDisplay);
