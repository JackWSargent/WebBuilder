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
import { ConvertToCopiedComponent } from "../utils/ConvertComponent";
import { store } from "../redux/store/storeConfiguration";
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
    let selected: Component[] = components.filter((component) => component.selected === true);

    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [stateComponents, setStateComponents] = React.useState([]);
    const [componentName, setComponentName] = React.useState(selected.length === 1 ? selected[0].name : "");
    const [componentType, setComponentType] = React.useState(selected.length === 1 ? selected[0].type : "");
    const [componentInnerText, setComponentInnerText] = React.useState(
        selected.length === 1 ? selected[0].innerText : ""
    );

    React.useEffect(() => {
        selected = store.getState().components.filter((component) => component.selected === true);
        if (stateComponents.length !== components.length || stateComponents !== components) {
            setStateComponents(components);
            RenderEditComponent();
        }
        if (selected[0] && selected.length === 1) {
            setComponentName(selected[0].name);
            setComponentType(selected[0].type);
            setComponentInnerText(selected[0].innerText);
            RenderEditComponent();
        }
    }, [open, components, keyPress, history, componentName]);

    const HandleExpand = (): void => {
        setOpen(!open);
    };

    const HasSelectedComponent = (): boolean => {
        if (selected.length === 1 && selected[0].id !== 100) {
            return true;
        }
        return false;
    };

    const SetComponentProps = (e, prop: string): void => {
        let selectedComp: Component = selected[0];
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
        let newComponent: Component = {
            id: componentId,
            name: newComponentName,
            type: newComponentType,
            isRendered: false,
            nestedLevel: selectedComp.nestedLevel,
            parent: selectedComp.parent,
            children: selectedComp.children,
            selected: selectedComp.selected, //
            innerText: newComponentInnerText,
            sequenceNumber: selectedComp.sequenceNumber,
        };
        props.EditComponent(newComponent);
        props.AddHistory({ undo: [selectedComp] });
    };

    const CopyToClipboard = (): void => {
        if (HasSelectedComponent() && GetSelectedName()) {
            let selectedComponent: Component = selected[0];
            let convertedComponent: CopiedComponent = ConvertToCopiedComponent(selectedComponent);
            if (convertedComponent !== clipboard) {
                props.CopyComponent(convertedComponent);
            }
        }
    };

    const PasteComponent = (): void => {
        if (HasSelectedComponent() && GetSelectedName()) {
            let selectedComponent: Component = selected[0];
            let newComponent: Component = {
                ...selectedComponent,
                ...clipboard,
            };
            props.PasteComponent(selectedComponent.id, clipboard);
            renderedComponentArr = [];
            newComponentType = newComponent.type;
            newComponentName = newComponent.name;
            newComponentInnerText = newComponent.innerText;
        }
    };

    const GetSelectedName = (): string => {
        if (HasSelectedComponent()) {
            return selected[0].name;
        }
        return "";
    };

    const GetSelectedType = (): string => {
        if (HasSelectedComponent()) {
            return selected[0].type;
        }
        return "";
    };

    const GetSelectedId = (): number => {
        if (HasSelectedComponent()) {
            return selected[0].id;
        }
        return 0;
    };

    const GetSelectedInnerText = (): string => {
        if (HasSelectedComponent()) {
            return selected[0].innerText;
        }
        return "";
    };

    let componentId = GetSelectedId();
    let newComponentType = GetSelectedType();
    let newComponentName = GetSelectedName();
    let newComponentInnerText = GetSelectedInnerText();

    const renderElementName = (): JSX.Element[] => {
        if (!HasSelectedComponent()) {
            return [];
        }
        return selected.map((component) => (
            <TextField
                id="nameControl"
                variant="outlined"
                type="string"
                key={component.id}
                value={componentName}
                onChange={(e) => SetComponentProps(e, "name")}
                disabled={!HasSelectedComponent()}
            />
        ));
    };

    const renderElementInnerText = (): JSX.Element[] => {
        if (!HasSelectedComponent()) {
            return [];
        }
        return selected.map((component) => (
            <TextField
                id="innerTextControl"
                variant="outlined"
                type="string"
                multiline
                value={componentInnerText}
                key={component.id}
                onChange={(e) => SetComponentProps(e, "innerText")}
                disabled={!HasSelectedComponent()}
            />
        ));
    };

    const renderElementType = (): JSX.Element => {
        if (!HasSelectedComponent) return;
        if (newComponentName.length > -1 && selected.length === 1) {
            return (
                <Select
                    native
                    onChange={(e) => SetComponentProps(e, "type")}
                    value={componentType}
                    disableUnderline
                    style={{}}>
                    <option value={"gridContainer"}>Grid Container</option>
                    <option value={"gridItem"}>Grid Item</option>
                </Select>
            );
        }
    };

    const RenderCopyPaste = (): JSX.Element => {
        return (
            <Grid container style={{ marginTop: "10px" }}>
                <Grid item xs={4}>
                    <MdCopy color="white" id="copy" fontSize="35px" onClick={() => CopyToClipboard()}></MdCopy>
                    <MdClipboard
                        color="white"
                        id="paste"
                        fontSize="35px"
                        style={{ marginLeft: "4px" }}
                        onClick={() => PasteComponent()}></MdClipboard>
                </Grid>
                <Grid item xs={8} />
            </Grid>
        );
    };

    const RenderNameField = (): JSX.Element => {
        return (
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
        );
    };

    const RenderTypeField = (): JSX.Element => {
        return (
            <Grid container>
                <Typography variant="subtitle1" style={{ lineHeight: "64px", marginLeft: "20px", marginRight: "20px" }}>
                    Type
                </Typography>
                {renderElementType()}
            </Grid>
        );
    };

    const RenderInnerTextField = (): JSX.Element => {
        return (
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
        );
    };

    const LengthIsOne = (arr: Array<any>): boolean => {
        return arr.length === 1;
    };

    const RenderEditComponent = (): void => {
        selected = components.filter((component) => component.selected === true);
        if (LengthIsOne(selected)) {
            setComponentName(selected[0].name);
            setComponentType(selected[0].type);
            setComponentInnerText(selected[0].innerText);
        }
        renderedComponentArr = [];
        if (HasSelectedComponent()) {
            let comp: Component = selected[0];
            let editComp: JSX.Element = (
                <div key={comp.id}>
                    <ExpansionPanel
                        expanded={open}
                        style={{ marginTop: 0, marginBottom: 0, borderTop: "1px solid rgba(255, 255, 255, 0.12)" }}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            style={{ backgroundColor: "#2e2e2e" }}
                            onClick={HandleExpand}>
                            <Typography className={classes.heading}>{comp.name}</Typography>
                        </ExpansionPanelSummary>

                        {RenderCopyPaste()}
                        {RenderNameField()}
                        {RenderTypeField()}
                        {RenderInnerTextField()}
                    </ExpansionPanel>
                </div>
            );
            renderedComponentArr = [editComp];
            setStateComponents([editComp]);
        }
    };

    const ReturnEditComponent = () => {
        if (HasSelectedComponent()) {
            return renderedComponentArr;
        }
    };

    return <>{ReturnEditComponent()}</>;
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
    PasteComponent: (id: number, copiedComponent: CopiedComponent) => void;
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
