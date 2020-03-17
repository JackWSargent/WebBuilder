import * as React from "react";
/* eslint-disable */
import "../App.css";
import Layer from "./layer";
import CanvasDisplay from "./canvas";
import {
    makeStyles,
    useTheme,
    Theme,
    createStyles
} from "@material-ui/core/styles";
import { connect } from "react-redux";
import { startSetComponents } from "../redux/actions/components";
import { startSetCanvas } from "../redux/actions/canvas";
import { Components, Canvas } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { Dispatch, bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
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
                <>
                    <Layer></Layer>
                    <CanvasDisplay />
                </>
            );
        } else {
            return (
                <>
                    <CanvasDisplay />
                    <Layer></Layer>
                </>
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

const mapStateToProps = (
    state: AppState,
    ownProps: LayoutProps
): LinkStateProps => ({
    components: state.components,
    canvas: state.canvas
});

interface LinkDispatchProps {
    startSetComponents: (components: Components[]) => void;
    startSetCanvas: (canvas: Canvas[]) => void;
}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: LayoutProps
): LinkDispatchProps => ({
    startSetComponents: bindActionCreators(startSetComponents, dispatch),
    startSetCanvas: bindActionCreators(startSetCanvas, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
