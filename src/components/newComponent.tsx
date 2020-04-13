import * as React from "react";
import "../App.css";
import clsx from "clsx";
import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Component } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";
// import clsx from "clsx";
import { SetComponent } from "../redux/actions/component";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        renderer: {
            minWidth: "100vh",
            maxWidth: "100vh",
            width: 1000,
        },
    })
);

interface NewComponentProps {}

type Props = NewComponentProps & LinkStateProps & LinkDispatchProps;

const NewComponent: React.FC<Props> = (props) => {
    const { component } = props;
    const classes = useStyles();

    const [newComponentName, setNewComponentName] = React.useState("");
    const [newComponentType, setNewComponentType] = React.useState("");
    const [newComponentParent, setNewComponentParent] = React.useState(null);
    const [newComponentNestedLevel, setNewComponentNestedLevel] = React.useState(null);

    const hasSelectedLayer = () => {
        let selectedComponents = [];
        component.map((layer) => {
            if (layer.selected === true) {
                selectedComponents.push(layer);
            }
        });
        if (selectedComponents.length === 1) {
            return true;
        }
        return false;
    };

    const onNewComponent = (componentProps) => {};

    return <div></div>;
};

interface LinkStateProps {
    component: Component[];
}

const mapStateToProps = (state: AppState, ownProps: NewComponentProps): LinkStateProps => ({
    component: state.component,
});

interface LinkDispatchProps {
    SetComponent: (component: Component[]) => void;
}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: NewComponentProps
): LinkDispatchProps => ({
    SetComponent: bindActionCreators(SetComponent, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewComponent);
