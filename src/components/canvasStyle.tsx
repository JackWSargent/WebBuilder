import * as React from "react";
/* eslint-disable */
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { CanvasStyling } from "../redux/types/actions";
import { AppState } from "../redux/store/storeConfiguration";
import { bindActionCreators } from "redux";
import { AppActions } from "../redux/types/actions";
import { ThunkDispatch } from "redux-thunk";
import { TextField } from "@material-ui/core";
import { SetCanvasStyling } from "../redux/actions/canvasStyling";
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
        },
    })
);
interface CanvasStylingProps {}

type Props = CanvasStylingProps & LinkStateProps & LinkDispatchProps;
const CanvasStyle: React.FC<Props> = (props) => {
    const { canvasStyling } = props;
    const classes = useStyles();
    const [fontSize, setFontSize] = React.useState(canvasStyling.fontSize);
    const [boxSizing, setBoxSizing] = React.useState(canvasStyling.boxSizing);
    const [open, setOpen] = React.useState(false);
    const handleFontSizeChange = (e) => {
        setFontSize(e.target.value);
    };
    const handleBoxSizingChange = (e) => {
        setBoxSizing(e.target.value);
    };

    const handleApplyChanges = (e) => {
        onSet({ fontSize, boxSizing });
    };
    const onSet = (canvasStyling: CanvasStyling) => {
        props.SetCanvasStyling(canvasStyling);
    };

    const handleExpand = () => {
        setOpen(!open);
    };

    React.useEffect(() => {}, [open]);
    return (
        <div style={{ maxWidth: "240px" }}>
            <ExpansionPanel expanded={open} style={{ borderTop: "1px solid rgba(255, 255, 255, 0.12)" }}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    style={{ backgroundColor: "#2e2e2e" }}
                    onClick={handleExpand}>
                    <Typography className={classes.heading}>Canvas Styling</Typography>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails className={classes.details}>
                    <Grid container style={{ marginTop: 20 }}>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={8}>
                            <TextField
                                id="fontSizeControl"
                                label="Font Size(px)"
                                variant="outlined"
                                type="number"
                                defaultValue={fontSize}
                                onChange={(e) => handleFontSizeChange(e)}
                                inputProps={{
                                    style: { color: "#fff", borderColor: "#fff" },
                                }}
                                className={classes.textField}
                                InputLabelProps={{
                                    style: {
                                        color: "#fff !important",
                                        borderColor: "#fff",
                                    },
                                }}
                                InputProps={{
                                    style: {
                                        color: "#fff !important",
                                        borderColor: "#fff",
                                    },
                                }}></TextField>
                        </Grid>
                        <Grid item xs={3}></Grid>
                    </Grid>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails className={classes.details}>
                    <Grid container>
                        <Grid item xs={5}>
                            <Typography variant="subtitle1" noWrap style={{ lineHeight: "64px" }}>
                                Box Sizing
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Select
                                native
                                onChange={(e) => handleBoxSizingChange(e)}
                                defaultValue={"border-box"}
                                style={{
                                    justifyContent: "center",
                                    alignContent: "center",
                                    marginTop: 15,
                                }}>
                                <option value={"border-box"}>Border-Box</option>
                                <option value={"content-box"}>Content-Box</option>
                            </Select>
                        </Grid>
                    </Grid>
                </ExpansionPanelDetails>
                <ExpansionPanelDetails className={classes.details}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                fullWidth
                                size="small"
                                onClick={handleApplyChanges}
                                style={{
                                    fontSize: 20,
                                    color: "#fff",
                                    backgroundColor: "#2e2e2e",
                                }}>
                                Apply
                            </Button>
                        </Grid>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    );
};
interface LinkStateProps {
    canvasStyling: CanvasStyling;
}

const mapStateToProps = (state: AppState, ownProps: CanvasStylingProps): LinkStateProps => ({
    canvasStyling: state.canvasStyling,
});

interface LinkDispatchProps {
    SetCanvasStyling: (canvasStyling: CanvasStyling) => void;
}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: CanvasStylingProps
): LinkDispatchProps => ({
    SetCanvasStyling: bindActionCreators(SetCanvasStyling, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CanvasStyle);
