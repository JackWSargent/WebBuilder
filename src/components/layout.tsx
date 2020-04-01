import * as React from "react";
/* eslint-disable */
import "../App.css";
import Layer from "./layer";
import CanvasDisplay from "./canvas";
import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { SetComponents } from "../redux/actions/components";
import { SetCanvas } from "../redux/actions/canvas";
import { Components, Canvas } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { Dispatch, bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: "#282c34",
            color: "#fff"
        }
    })
);
interface LayoutProps {}

type Props = LayoutProps & LinkStateProps & LinkDispatchProps;

const Layout: React.FC<Props> = props => {
    const { components, canvas } = props;

    const classes = useStyles();
    const theme = useTheme();

    React.useEffect(() => {}, [canvas[0].drawerOpen]);

    const renderComponents = () => {
        if (canvas[0].drawerOpen === true) {
            // console.log("drawer open");
            return (
                <div className={classes.root}>
                    <Layer />
                    <CanvasDisplay />
                </div>
            );
        } else {
            return (
                <div className={classes.root}>
                    <CanvasDisplay />
                    <Layer></Layer>
                </div>
            );
        }
    };

    /* eslint-enable */
    return <div className="App">{renderComponents()}</div>;
};

interface LinkStateProps {
    components: Components[];
    canvas: Canvas[];
}

const mapStateToProps = (state: AppState, ownProps: LayoutProps): LinkStateProps => ({
    components: state.components,
    canvas: state.canvas
});

interface LinkDispatchProps {
    SetComponents: (components: Components[]) => void;
    SetCanvas: (canvas: Canvas[]) => void;
}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: LayoutProps
): LinkDispatchProps => ({
    SetComponents: bindActionCreators(SetComponents, dispatch),
    SetCanvas: bindActionCreators(SetCanvas, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
