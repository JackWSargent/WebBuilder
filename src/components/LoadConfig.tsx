import * as React from "react";
/* eslint-disable */
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { History } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";
import { TextField } from "@material-ui/core";
import { AddHistory } from "../redux/actions/history";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            "& > *": {
                margin: theme.spacing(1),
                width: 200,
                color: "#fff",
            },
        },
        textField: {
            color: "#fff",
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: 600,
        },
        details: {
            padding: 0,
            maxWidth: 240,
        },
    })
);
interface LoadConfigProps {}
let renderedComponents = [];
type Props = LoadConfigProps & LinkStateProps & LinkDispatchProps;
const LoadConfig: React.FC<Props> = (props) => {
    // const { } = props;
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    React.useEffect(() => {
        renderedComponents = [];
        ReRenderLoadConfig();
    }, [open]);

    const ReRenderLoadConfig = () => {
        renderedComponents = [];
        RenderLoadConfig();
        return renderedComponents;
    };

    const HandleFile = (e) => {};

    const RenderLoadConfig = () => {
        renderedComponents.push(
            <div key={0} style={{ maxWidth: "240px" }}>
                <ExpansionPanel expanded={open} style={{ borderTop: "1px solid rgba(255, 255, 255, 0.12)" }}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        style={{ backgroundColor: "#2e2e2e" }}
                        onClick={HandleExpand}>
                        <Typography className={classes.heading}>Load Config</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.details}>
                        <Grid container style={{ height: 64 }}>
                            <input
                                style={{ height: 64, paddingLeft: 20, paddingTop: 20, maxWidth: 240 }}
                                type="file"
                                id="config-input"
                                onChange={(e) => HandleFile(e)}
                            />
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );
    };

    const HandleExpand = (): void => {
        setOpen(!open);
    };

    return <>{ReRenderLoadConfig()} </>;
};
interface LinkStateProps {}

const mapStateToProps = (state: AppState, ownProps: LoadConfigProps): LinkStateProps => ({});

interface LinkDispatchProps {}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: LoadConfigProps
): LinkDispatchProps => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LoadConfig);
