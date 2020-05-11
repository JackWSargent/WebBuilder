import * as React from "react";
/* eslint-disable */
import "../App.css";
import Layer from "./Layer";
import CanvasDisplay from "./Canvas";
import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { SetCanvas } from "../redux/actions/canvas";
import { Canvas } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";

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
    const { canvas } = props;

    const classes = useStyles();
    const theme = useTheme();

    React.useEffect(() => {}, [canvas.drawerOpen]);

    const renderComponents = () => {
        return (
            <div className={classes.root}>
                <Layer />
                <CanvasDisplay />
            </div>
        );
    };

    /* eslint-enable */
    return <div className="App">{renderComponents()}</div>;
};

interface LinkStateProps {
    canvas: Canvas;
}

const mapStateToProps = (state: AppState, ownProps: LayoutProps): LinkStateProps => ({
    canvas: state.canvas,
});

interface LinkDispatchProps {
    SetCanvas: (canvas: Canvas) => void;
}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: LayoutProps
): LinkDispatchProps => ({
    SetCanvas: bindActionCreators(SetCanvas, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
