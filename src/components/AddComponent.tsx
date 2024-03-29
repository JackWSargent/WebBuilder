import * as React from "react";
import "../App.css";
/* eslint-disable */
import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Component, History, Undo, Redo } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";
import { SetComponents, AddComponent } from "../redux/actions/components";
import { AddHistory } from "../redux/actions/history";
import {
    Grid,
    Select,
    Button,
    Typography,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: 600,
        },
    })
);

interface NewComponentProps {}

type Props = NewComponentProps & LinkStateProps & LinkDispatchProps;

const NewComponent: React.FC<Props> = (props) => {
    const { components, history } = props;
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [newComponentType, setNewComponentType] = React.useState("gridContainer");

    React.useEffect(() => {}, [open]);

    const HandleExpand = (): void => {
        setOpen(!open);
    };

    const HasSelectedComponent = (): Component => {
        let selectedComponents = [];
        components.map((comp) => {
            if (comp.selected === true) {
                selectedComponents.push(comp);
            }
        });
        if (selectedComponents.length === 1) {
            return selectedComponents[0];
        }
        return;
    };

    const GetId = (): number => {
        let highestId = 0;
        components.forEach((component) => {
            if (component.id > highestId) {
                highestId = component.id;
            }
        });
        return highestId + 100;
    };

    const SetComponentProps = (e): void => {
        setNewComponentType(e.target.value);
    };

    const HandleNewComponent = (): void => {
        if (!HasSelectedComponent) {
            return;
        }
        let parentComponent = HasSelectedComponent();
        let newComponentObj: Component = {
            id: GetId(),
            isRendered: false,
            name: "New " + newComponentType,
            type: newComponentType,
            selected: false,
            children: null,
            parent: parentComponent.id,
            nestedLevel: parentComponent.nestedLevel + 1,
            sequenceNumber: parentComponent.children !== null ? parentComponent.children.length : 0,
        };

        props.AddHistory({ undo: components });
        props.AddComponent(newComponentObj);
    };

    return (
        <div>
            <ExpansionPanel
                expanded={open}
                style={{ marginTop: 0, marginBottom: 0, borderTop: "1px solid rgba(255, 255, 255, 0.12)" }}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    style={{ backgroundColor: "#2e2e2e" }}
                    onClick={HandleExpand}>
                    <Typography className={classes.heading}>New Component</Typography>
                </ExpansionPanelSummary>
                <Grid container>
                    <Grid item xs={3}>
                        <Typography variant="subtitle1" noWrap style={{ lineHeight: "64px", marginLeft: "20px" }}>
                            Type
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <Select
                            native
                            onChange={(e) => SetComponentProps(e)}
                            defaultValue={"gridContainer"}
                            style={{
                                justifyContent: "center",
                                alignContent: "center",
                                marginTop: 15,
                            }}>
                            <option value={"gridContainer"}>Grid Container</option>
                            <option value={"gridItem"}>Grid Item</option>
                        </Select>
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            fullWidth
                            size="small"
                            onClick={HandleNewComponent}
                            style={{
                                fontSize: 20,
                                color: "#fff",
                                backgroundColor: "#2e2e2e",
                            }}>
                            Add
                        </Button>
                    </Grid>
                </Grid>
            </ExpansionPanel>
        </div>
    );
};

interface LinkStateProps {
    components: Component[];
    history: History;
}

const mapStateToProps = (state: AppState, ownProps: NewComponentProps): LinkStateProps => ({
    components: state.components,
    history: state.history,
});

interface LinkDispatchProps {
    SetComponents: (components: Component[]) => void;
    AddComponent: (component: Component) => void;
    AddHistory: (history: History) => void;
}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: NewComponentProps
): LinkDispatchProps => ({
    SetComponents: bindActionCreators(SetComponents, dispatch),
    AddComponent: bindActionCreators(AddComponent, dispatch),
    AddHistory: bindActionCreators(AddHistory, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewComponent);
