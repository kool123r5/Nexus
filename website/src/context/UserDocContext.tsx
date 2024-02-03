import { createContext, useState, useEffect } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import PropTypes from "prop-types";

export const UserDocContext = createContext();

export const UserDocContextProvider = ({ children }) => {
    const [state, setState] = useState({ userDoc: null, error: null });

    useEffect(() => {
        try {
            const unsub = projectAuth.onAuthStateChanged((user) => {
                const unsub_ref = projectFirestore
                    .collection("users")
                    .doc(user.uid)
                    .onSnapshot((snapshot) => {
                        if (snapshot.data()) {
                            setState({
                                userDoc: snapshot.data(),
                                error: null,
                            });
                        }
                    });
                return () => {
                    unsub_ref();
                };
            });
            return () => {
                unsub();
            };
        } catch (error) {
            setState({
                userDoc: null,
                error: error,
            });
        }
    }, []);

    return <UserDocContext.Provider value={{ ...state, setState }}>{children}</UserDocContext.Provider>;
};

UserDocContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
