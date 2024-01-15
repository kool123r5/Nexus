import { useState, useEffect } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import { googleProvider } from "../firebase/config";
import { useNavigate } from "react-router-dom";

import "firebase/firestore";
import firebase from "firebase/app";
import { useLogout } from "./useLogout";

export const useLogin = () => {
    const [isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState(false);
    const { logout } = useLogout();
    const [isPending, setIsPending] = useState(false);
    const { dispatch } = useAuthContext();
    const [type, setType] = useState(null);
    const [userFailure, setUserFailure] = useState(false);
    const navigateTo = useNavigate();

    const login = async (email, password) => {
        setError(false);
        setIsPending(true);
        setType(null);

        try {
            // login
            const userDoc = await projectFirestore.collection("users").where("email", "==", email).limit(1).get();
            if (userDoc.docs[0].data().authProviders.length == 1 && userDoc.docs[0].data().authProviders[0] == "google") {
                setError(
                    "You previously signed up with Google. Login with Google and then set a password in your account settings to be able to sign up with email & password in the future."
                );
                setIsPending(false);
            } else {
                const res = await projectAuth.signInWithEmailAndPassword(email, password);

                // dispatch login action

                dispatch({ type: "LOGIN", payload: res.user });

                if (!isCancelled && !userFailure) {
                    setIsPending(false);
                    setError(false);
                }
            }
        } catch (error) {
            if (!isCancelled) {
                setError(JSON.parse(error.message)["error"]["message"]);
                logout();
                setIsPending(false);
            }
        }
    };

    const loginWithGoogle = async () => {
        setError(null);
        setIsPending(true);

        try {
            const res = await projectAuth.signInWithPopup(googleProvider);
            const userDoc = await projectFirestore.collection("users").doc(res.user.uid).get();

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
                throw new Error("User not registered");
            }

            navigateTo("/");

            if (!isCancelled && !userFailure) {
                setIsPending(false);
                setError(null);
            }
        } catch (err) {
            console.log(err.message);
            if (isCancelled) {
                setError(err.message);

                console.log(error);
                setIsPending(false);
            }
        }
    };

    // useEffect(() => {
    //     return () => setIsCancelled(true);
    // }, []);

    return { login, loginWithGoogle, isPending, error };
};
