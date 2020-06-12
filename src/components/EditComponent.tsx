import * as React from "react";
import "../App.css";
/* eslint-disable */
import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Component, CopiedComponent } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";
import { SetComponents, AddComponent, EditComponent, PasteComponent } from "../redux/actions/components";
import { CopyComponent } from "../redux/actions/clipboard";
import {
    Grid,
    TextField,
    Select,
    Button,
    Typography,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MdCopy from "react-ionicons/lib/MdCopy";
import MdClipboard from "react-ionicons/lib/MdClipboard";
import { ConvertToCopiedComponent, ConvertToComponent } from "../utils/ConvertComponent";

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
let renderedComponentArr: JSX.Element[] = [];

const EditComponentTab: React.FC<Props> = (props) => {
    const { components, clipboard } = props;
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [layers, setLayers] = React.useState(components);

    let selected = components.filter((component) => component.selected === true);

    const handleExpand = (): void => {
        setOpen(!open);
    };

    const hasSelectedLayer = (): boolean => {
        if (selected.length === 1 && selected[0].id !== 100) {
            console.log(selected);
            return true;
        }
        return false;
    };

    const setComponentProps = (e, prop): void => {
        let newComponent = {
            id: componentId,
            type: null,
            name: null,
            innerText: null,
        };
        console.log("prop: " + prop);
        switch (prop) {
            case "type": {
                newComponentType = e.target.value;
                break;
            }
            case "name": {
                newComponentName = e.target.value;
                break;
            }
            case "innerText": {
                newComponentInnerText = e.target.value;
                break;
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

    const copyToClipboard = (): void => {
        if (hasSelectedLayer() && getSelectedName()) {
            let selectedComponent = selected[0];
            let convertedComponent = ConvertToCopiedComponent(selectedComponent);
            if (convertedComponent !== clipboard) {
                props.CopyComponent(convertedComponent);
            }
        }
    };

    const pasteComponent = (): void => {
        if (hasSelectedLayer() && getSelectedName()) {
            let selectedComponent = selected[0];
            let newComponent = {
                ...selectedComponent,
                ...clipboard,
            };
            props.EditComponent(newComponent);
            renderedComponentArr = [];
            newComponentType = newComponent.type;
            newComponentName = newComponent.name;
            newComponentInnerText = newComponent.innerText;
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
        return selected.map((component) => (
            <TextField
                id="nameControl"
                variant="outlined"
                type="string"
                key={component.id}
                defaultValue={component.name}
                onChange={(e) => setComponentProps(e, "name")}
                disabled={!hasSelectedLayer()}
            />
        ));
    };

    const renderElementInnerText = () => {
        if (!hasSelectedLayer) {
            return;
        }
        return selected.map((component) => (
            <TextField
                id="innerTextControl"
                variant="outlined"
                type="string"
                multiline
                key={component.id}
                defaultValue={component.innerText}
                onChange={(e) => setComponentProps(e, "innerText")}
                disabled={!hasSelectedLayer()}
            />
        ));
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

    const renderEditComponent = () => {
        if (hasSelectedLayer()) {
            let editComp = selected.map((comp) => {
                return (
                    <div key={comp.id}>
                        <ExpansionPanel
                            expanded={open}
                            style={{ marginTop: 0, marginBottom: 0, borderTop: "1px solid rgba(255, 255, 255, 0.12)" }}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                style={{ backgroundColor: "#2e2e2e" }}
                                onClick={handleExpand}>
                                <Typography className={classes.heading}>{comp.name}</Typography>
                            </ExpansionPanelSummary>
                            <Grid container style={{ marginTop: "10px" }}>
                                <Grid item xs={4}>
                                    <MdCopy
                                        color="white"
                                        id="copy"
                                        fontSize="35px"
                                        onClick={() => copyToClipboard()}></MdCopy>
                                    <MdClipboard
                                        color="white"
                                        id="paste"
                                        fontSize="35px"
                                        style={{ marginLeft: "4px" }}
                                        onClick={() => pasteComponent()}></MdClipboard>
                                </Grid>
                                <Grid item xs={8} />
                            </Grid>

                            <Grid container style={{ marginTop: "10px" }}>
                                <Grid item xs={3}>
                                    <Typography
                                        variant="subtitle1"
                                        style={{
                                            lineHeight: "64px",
                                            // marginLeft: "10px",
                                            // marginRight: "20px",
                                            alignItems: "left",
                                        }}>
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
                        </ExpansionPanel>
                    </div>
                );
            });
            renderedComponentArr = editComp;
        }
    };

    const returnEditComponent = () => {
        if (hasSelectedLayer()) {
            return renderedComponentArr;
        }
    };

    React.useEffect(() => {
        selected = components.filter((component) => component.selected === true);
        if (layers.length !== components.length || layers !== components) {
            setLayers(components);
            renderEditComponent();
        }
    }, [open, components]);

    return <div>{returnEditComponent()}</div>;
};

interface LinkStateProps {
    components: Component[];
    clipboard: CopiedComponent;
}

const mapStateToProps = (state: AppState, ownProps: EditComponentProps): LinkStateProps => ({
    components: state.components,
    clipboard: state.clipboard,
});

interface LinkDispatchProps {
    SetComponents: (components: Component[]) => void;
    AddComponent: (component: Component) => void;
    EditComponent: (component: Component) => void;
    CopyComponent: (copiedComponent: CopiedComponent) => void;
    PasteComponent: (id: number) => void;
}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: EditComponentProps
): LinkDispatchProps => ({
    SetComponents: bindActionCreators(SetComponents, dispatch),
    AddComponent: bindActionCreators(AddComponent, dispatch),
    EditComponent: bindActionCreators(EditComponent, dispatch),
    CopyComponent: bindActionCreators(CopyComponent, dispatch),
    PasteComponent: bindActionCreators(PasteComponent, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditComponentTab);
