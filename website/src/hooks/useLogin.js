import { useState, useEffect } from "react";
import { projectAuth, projectFirestore, googleProvider } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import "firebase/firestore";
import firebase from "firebase/app";
import { useLogout } from "./useLogout";

export const useLogin = () => {
    const [isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState(null);
    const [googleError, setGoogleError] = useState(null);
    const { logout } = useLogout();
    const [isPending, setIsPending] = useState(false);
    const { dispatch } = useAuthContext();

    const login = async (email, password) => {
        setError(null);
        setGoogleError(null);
        setIsPending(true);

        try {
            // login
            const res = await projectAuth.signInWithEmailAndPassword(email, password);

            // dispatch login action
            dispatch({ type: "LOGIN", payload: res.user });

            if (!isCancelled) {
                setIsPending(false);
                setError(null);
                setGoogleError(null);
            }
        } catch (err) {
            if (!isCancelled) {
                console.log(err);
                if (JSON.stringify(err.message).includes("INVALID_LOGIN_CREDENTIALS")) {
                    setError("Invalid Login Credentials");
                } else {
                    setError(err.message);
                }
                logout();
                setIsPending(false);
            }
        }
    };

    const loginWithGoogle = async () => {
        setError(null);
        setGoogleError(null);
        setIsPending(true);

        try {
            const res = await projectAuth.signInWithPopup(googleProvider);
            const userDoc = await projectFirestore.collection("users").doc(res.user.uid).get();

            if (!isCancelled) {
                setIsPending(false);
                setError(null);
                setGoogleError(null);
            }

            if (userDoc.exists) {
                await projectFirestore
                    .collection("users")
                    .doc(res.user.uid)
                    .update({
                        authProviders: firebase.firestore.FieldValue.arrayUnion("google"),
                    });
                // dispatch login action
                dispatch({ type: "LOGIN", payload: res.user });
            } else {
                // Delete the user authentication object if not registered
                await projectAuth.currentUser.delete();
                console.log("here");
                setGoogleError("User not registered");
            }
        } catch (err) {
            if (!isCancelled) {
                console.log(err);
                setGoogleError(err.message);
                await logout();
                setIsPending(false);
            }
        }
    };

    useEffect(() => {
        return () => setIsCancelled(true);
    }, []);

    return { login, loginWithGoogle, isPending, error, googleError };
};
