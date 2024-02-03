import { createContext, useReducer, useEffect } from "react";
import { projectAuth } from "../firebase/config";
import PropTypes from "prop-types";
import { authReducer } from "./authReducer";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        authIsReady: false,
    });

    useEffect(() => {
        const unsub = projectAuth.onAuthStateChanged((user) => {
            dispatch({ type: "AUTH_IS_READY", payload: user });
            unsub();
        });
    }, []);

    return <AuthContext.Provider value={{ ...state, dispatch }}>{children}</AuthContext.Provider>;
};

AuthContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
