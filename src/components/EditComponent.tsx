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
import { SetComponents, AddComponent, EditComponent } from "../redux/actions/components";
import { Grid } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { TextField } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: 600,
        },
    })
);

interface EditComponentProps {}

type Props = EditComponentProps & LinkStateProps & LinkDispatchProps;

const EditComponentTab: React.FC<Props> = (props) => {
    const { components } = props;
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    let selected = components.filter((component) => component.selected === true);

    React.useEffect(() => {
        selected = components.filter((component) => component.selected === true);
    }, [open, components]);

    const handleExpand = () => {
        setOpen(!open);
    };

    const hasSelectedLayer = () => {
        if (selected.length === 1 && selected[0].id !== 100) {
            return true;
        }
        return false;
    };

    const setComponentProps = (e, prop) => {
        let newComponent = {
            id: componentId,
            type: null,
            name: null,
            innerText: null,
        };
        switch (prop) {
            case "type": {
                newComponentType = e.target.value;
            }
            case "name": {
                newComponentName = e.target.value;
            }
            case "innerText": {
                newComponentInnerText = e.target.value;
            }
        }
        newComponent = {
            id: componentId,
            type: newComponentType,
            name: newComponentName,
            innerText: newComponentInnerText,
        };
        if (newComponent.name && newComponent.id) {
            props.EditComponent(newComponent);
        }
    };

    const getSelectedName = () => {
        if (hasSelectedLayer()) {
            return selected[0].name;
        }
        return "";
    };

    const getSelectedType = () => {
        if (hasSelectedLayer()) {
            return selected[0].type;
        }
        return "";
    };

    const getSelectedId = () => {
        if (hasSelectedLayer()) {
            return selected[0].id;
        }
        return 0;
    };

    const getSelectedInnerText = () => {
        if (hasSelectedLayer()) {
            return selected[0].innerText;
        }
        return "";
    };

    let componentId = getSelectedId();
    let newComponentType = getSelectedType();
    let newComponentName = getSelectedName();
    let newComponentInnerText = getSelectedInnerText();

    const renderElementName = () => {
        if (!hasSelectedLayer) {
            return;
        }
        if (selected.length === 1) {
            return selected.map((component) => (
                <TextField
                    id="nameControl"
                    label="Name"
                    variant="outlined"
                    type="string"
                    key={component.id}
                    defaultValue={component.name}
                    onChange={(e) => setComponentProps(e, "name")}
                    disabled={!hasSelectedLayer()}
                />
            ));
        }
    };

    const renderElementInnerText = () => {
        if (!hasSelectedLayer) {
            return;
        }
        if (selected.length === 1) {
            return selected.map((component) => (
                <TextField
                    id="innerTextControl"
                    label="Inner Text"
                    variant="outlined"
                    type="string"
                    multiline
                    key={component.id}
                    defaultValue={component.innerText}
                    onChange={(e) => setComponentProps(e, "innerText")}
                    disabled={!hasSelectedLayer()}
                />
            ));
        }
    };

    const renderElementType = () => {
        if (!hasSelectedLayer) return;
        if (newComponentName.length > -1 && selected.length === 1) {
            return (
                <Select
                    native
                    onChange={(e) => setComponentProps(e, "type")}
                    defaultValue={newComponentType}
                    disableUnderline
                    style={{}}>
                    <option value={"gridContainer"}>Grid Container</option>
                    <option value={"gridItem"}>Grid Item</option>
                </Select>
            );
        }
    };

    // const handleNewComponent = () => {
    //     if (!hasSelectedLayer) {
    //         // console.log("does not have selected Component");
    //         return;
    //     }
    //     let componentObj = {
    //         name: newComponentName,
    //         type: newComponentType,
    //     };
    //     if (componentObj.type && componentObj.name) {
    //         props.AddComponent(componentObj);
    //     }
    // };

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
                    <Typography className={classes.heading}>{getSelectedName()}</Typography>
                </ExpansionPanelSummary>
                <Grid container style={{ marginTop: "10px" }}>
                    <Grid item xs={3}>
                        <Typography
                            variant="subtitle1"
                            style={{ lineHeight: "64px", marginLeft: "10px", marginRight: "20px" }}>
                            Name
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        {renderElementName()}
                        <Grid item />
                    </Grid>
                </Grid>
                <Grid container>
                    <Typography
                        variant="subtitle1"
                        style={{ lineHeight: "64px", marginLeft: "20px", marginRight: "20px" }}>
                        Type
                    </Typography>
                    {renderElementType()}
                </Grid>

                <Grid container>
                    <Grid item xs={3}>
                        <Typography
                            variant="subtitle1"
                            style={{ lineHeight: "64px", marginLeft: "10px", marginRight: "40px" }}>
                            InnerText
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        {renderElementInnerText()}
                        <Grid item />
                    </Grid>
                </Grid>

                {/* <Grid container>
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
                </Grid> */}
            </ExpansionPanel>
        </div>
    );
};

interface LinkStateProps {
    components: Component[];
}

const mapStateToProps = (state: AppState, ownProps: EditComponentProps): LinkStateProps => ({
    components: state.components,
});

interface LinkDispatchProps {
    SetComponents: (components: Component[]) => void;
    AddComponent: (component: Component) => void;
    EditComponent: (component: Component) => void;
}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: EditComponentProps
): LinkDispatchProps => ({
    SetComponents: bindActionCreators(SetComponents, dispatch),
    AddComponent: bindActionCreators(AddComponent, dispatch),
    EditComponent: bindActionCreators(EditComponent, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditComponentTab);
