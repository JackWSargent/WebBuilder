import * as React from "react";
/* eslint-disable */
import "./App.css";
import Layout from "./components/Layout";
import { Provider } from "react-redux";
import { store } from "./redux/store/storeConfiguration";
import { makeStyles, useTheme, Theme, createStyles, ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { withAuthenticator, AmplifySignOut, AmplifySignUp, AmplifySignIn } from "@aws-amplify/ui-react";
import { onAuthUIStateChange, AuthState } from "@aws-amplify/ui-components";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

const App: React.FC = () => {
    const classes = useStyles();
    const theme = createMuiTheme({
        palette: {
            type: "dark",
            primary: {
                main: "#fff",
            },
            secondary: {
                main: "rgba(255,255,255, 0.7)",
            },
        },
    });

    /* eslint-enable */
    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <Layout />
            </Provider>
        </ThemeProvider>
    );
};

export default withAuthenticator(App, { usernameAlias: "email", initialAuthState: AuthState.SignIn });
