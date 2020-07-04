import * as React from "react";
import "../App.css";
/* eslint-disable */
import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Component, CopiedComponent, History, KeyPress } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";
import { SetComponents, AddComponent, EditComponent, PasteComponent } from "../redux/actions/components";
import { AddHistory } from "../redux/actions/history";
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
    const { components, clipboard, history, keyPress } = props;
    let selected = components.filter((component) => component.selected === true);

    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [layers, setLayers] = React.useState([]);
    const [componentName, setComponentName] = React.useState(selected.length === 1 ? selected[0].name : "");
    const [componentType, setComponentType] = React.useState(selected.length === 1 ? selected[0].type : "");
    const [componentInnerText, setComponentInnerText] = React.useState(
        selected.length === 1 ? selected[0].innerText : ""
    );

    const handleExpand = (): void => {
        setOpen(!open);
    };

    const hasSelectedLayer = (): boolean => {
        if (selected.length === 1 && selected[0].id !== 100) {
            return true;
        }
        return false;
    };

    const setComponentProps = (e, prop): void => {
        let selectedComp = selected[0];
        switch (prop) {
            case "type": {
                newComponentType = e.target.value;
                setComponentType(e.target.value);
                break;
            }
            case "name": {
                newComponentName = e.target.value;
                setComponentName(e.target.value);
                break;
            }
            case "innerText": {
                newComponentInnerText = e.target.value;
                setComponentInnerText(e.target.value);
                break;
            }
        }
        let newComponent = {
            id: componentId,
            name: newComponentName,
            type: newComponentType,
            isRendered: false,
            nestedLevel: selectedComp.nestedLevel,
            parent: selectedComp.parent,
            children: selectedComp.children,
            selected: selectedComp.selected,
            innerText: newComponentInnerText,
        };

        props.EditComponent(newComponent);
        props.AddHistory({ undo: [selectedComp] });
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
                value={componentName}
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
                value={componentInnerText}
                key={component.id}
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
                    value={componentType}
                    disableUnderline
                    style={{}}>
                    <option value={"gridContainer"}>Grid Container</option>
                    <option value={"gridItem"}>Grid Item</option>
                </Select>
            );
        }
    };

    const renderEditComponent = () => {
        selected = components.filter((component) => component.selected === true);
        if (selected.length === 1) {
            setComponentName(selected[0].name);
            setComponentType(selected[0].type);
            setComponentInnerText(selected[0].innerText);
        }
        renderedComponentArr = [];
        if (hasSelectedLayer()) {
            let comp = selected[0];
            let editComp = (
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
            renderedComponentArr = [editComp];
            setLayers([editComp]);
        }
    };

    const returnEditComponent = () => {
        if (hasSelectedLayer()) {
            return renderedComponentArr;
        }
    };

    React.useEffect(() => {
        setLayers([]);
        selected = components.filter((component) => component.selected === true);
        if (layers.length !== components.length || layers !== components) {
            renderEditComponent();
        }
        if (selected[0] && selected.length === 1) {
            setComponentName(selected[0].name);
            setComponentType(selected[0].type);
            setComponentInnerText(selected[0].innerText);
            renderEditComponent();
        }
    }, [open, components, keyPress, history, componentName]);

    return <>{returnEditComponent()}</>;
};

interface LinkStateProps {
    components: Component[];
    clipboard: CopiedComponent;
    history: History;
    keyPress: KeyPress;
}

const mapStateToProps = (state: AppState, ownProps: EditComponentProps): LinkStateProps => ({
    components: state.components,
    clipboard: state.clipboard,
    history: state.history,
    keyPress: state.keyPress,
});

interface LinkDispatchProps {
    SetComponents: (components: Component[]) => void;
    AddComponent: (component: Component) => void;
    EditComponent: (component: Component) => void;
    CopyComponent: (copiedComponent: CopiedComponent) => void;
    PasteComponent: (id: number) => void;
    AddHistory: (history: History) => void;
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
    AddHistory: bindActionCreators(AddHistory, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditComponentTab);
