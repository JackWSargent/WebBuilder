import * as React from "react";
import "../App.css";
/* eslint-disable */
import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Component } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";
import { SetComponents, AddComponent } from "../redux/actions/components";
import { Grid } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
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
    const { components } = props;
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [newComponentType, setNewComponentType] = React.useState("gridContainer");

    React.useEffect(() => {}, [open]);

    const handleExpand = () => {
        setOpen(!open);
    };

    const hasSelectedLayer = () => {
        let selectedComponents = [];
        components.map((layer) => {
            if (layer.selected === true) {
                selectedComponents.push(layer);
            }
        });
        if (selectedComponents.length === 1) {
            return selectedComponents[0];
        }
        // console.log(selectedComponents);
        // console.log("false");
        return false;
    };

    const getId = (): number => {
        let highestId = 0;
        components.forEach((component) => {
            if (component.id > highestId) {
                highestId = component.id;
            }
        });
        return highestId + 100;
    };

    const setComponentProps = (e) => {
        setNewComponentType(e.target.value);
    };

    const handleNewComponent = () => {
        if (!hasSelectedLayer) {
            // console.log("does not have selected Component");
            return;
        }
        let parentLayer = hasSelectedLayer();
        let newComponentObj: Component = {
            id: getId(),
            isRendered: false,
            name: "New Component",
            type: newComponentType,
            selected: false,
            children: null,
            parent: parentLayer.id,
            nestedLevel: parentLayer.nestedLevel + 1,
        };

        console.log(newComponentObj);
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
                    onClick={handleExpand}>
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
                            onChange={(e) => setComponentProps(e)}
                            inputProps={{}}
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
                            onClick={handleNewComponent}
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
}

const mapStateToProps = (state: AppState, ownProps: NewComponentProps): LinkStateProps => ({
    components: state.components,
});

interface LinkDispatchProps {
    SetComponents: (components: Component[]) => void;
    AddComponent: (component: Component) => void;
}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: NewComponentProps
): LinkDispatchProps => ({
    SetComponents: bindActionCreators(SetComponents, dispatch),
    AddComponent: bindActionCreators(AddComponent, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewComponent);
