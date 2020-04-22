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
import { SetComponents } from "../redux/actions/components";
import { Grid } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
const useStyles = makeStyles((theme: Theme) => createStyles({}));

interface NewComponentProps {}

type Props = NewComponentProps & LinkStateProps & LinkDispatchProps;

const NewComponent: React.FC<Props> = (props) => {
    const { components } = props;
    const classes = useStyles();

    const [newComponentType, setNewComponentType] = React.useState("gridContainer");

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
        console.log(selectedComponents);
        console.log("false");
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
            console.log("does not have selected Component");
            return;
        }
        let parentLayer = hasSelectedLayer();
        let newComponentObj: Component = {
            id: getId(),
            isRendered: false,
            name: "New Component",
            type: newComponentType,
            selected: false,
            active: true,
            children: null,
            parent: parentLayer.id,
            nestedLevel: parentLayer.nestedLevel + 1,
            row: 0,
        };
        let newComponentArr = components.map((obj) => {
            if (obj.id === parentLayer.id) {
                if (parentLayer.children === null) {
                    let newChild = [newComponentObj.id];
                    console.log(newChild);
                    return { ...obj, children: newChild };
                } else {
                    let newChildren = parentLayer.children.map((el) => {
                        return el;
                    });
                    newChildren.push(newComponentObj.id);
                    console.log(newChildren);
                    return { ...obj, children: newChildren };
                }
            }
            console.log(obj);
            return obj;
        });

        console.log(newComponentArr);
        newComponentArr.push(newComponentObj);
        props.SetComponents(newComponentArr);
    };

    return (
        <div>
            <Grid container>
                <Grid item xs={12}>
                    <Typography
                        variant="h6"
                        noWrap
                        style={{
                            lineHeight: "64px",
                            alignContent: "center",
                            justifyContent: "center",
                        }}>
                        Insert
                    </Typography>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={1}></Grid>
                <Grid item xs={4}>
                    <Typography variant="subtitle1" noWrap style={{ lineHeight: "64px" }}>
                        Type
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Select
                        native
                        onChange={(e) => setComponentProps(e)}
                        inputProps={{}}
                        defaultValue={"gridContainer"}
                        style={{
                            justifyContent: "center",
                            alignContent: "center",
                            marginTop: 15,
                            marginLeft: 10,
                        }}>
                        <option value={"gridContainer"}>Grid Container</option>
                        <option value={"gridItem"}>Grid Item</option>
                    </Select>
                </Grid>
            </Grid>

            <Grid container>
                <Grid item xs={1}></Grid>
                <Grid item xs={10}>
                    <Button
                        variant="contained"
                        fullWidth
                        size="small"
                        onClick={handleNewComponent}
                        style={{
                            marginBottom: 50,
                            fontSize: 20,
                            color: "#fff",
                            backgroundColor: "#111111",
                        }}>
                        Insert
                    </Button>
                </Grid>
                <Grid item xs={1}></Grid>
            </Grid>
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
}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: NewComponentProps
): LinkDispatchProps => ({
    SetComponents: bindActionCreators(SetComponents, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewComponent);
