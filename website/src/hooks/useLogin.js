import { useState, useEffect } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import "firebase/firestore";
import { useLogout } from "./useLogout";

export const useLogin = () => {
    const [isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState(null);
    const { logout } = useLogout();
    const [isPending, setIsPending] = useState(false);
    const { dispatch } = useAuthContext();
    const [type, setType] = useState(null);
    const [userFailure, setUserFailure] = useState(false);
    const login = async (email, password) => {
        setError(null);
        setIsPending(true);
        setType(null);

        try {
            // login
            const res = await projectAuth.signInWithEmailAndPassword(email, password);

            // update online status
            const documentRef = projectFirestore.collection("users").doc(res.user.uid);
            const userDoc = await documentRef.get();
            const userType = userDoc.data().type;

            // dispatch login action

            if (userType !== "user") {
                setUserFailure(true);
                throw new Error("You must be an user to log in to this page.");
            } else if (!projectAuth.currentUser.emailVerified) {
                throw new Error("You must verify your email before logging in.");
            } else {
                if (userType === "user") {
                    dispatch({ type: "LOGIN", payload: res.user });
                }
            }
            if (!isCancelled && !userFailure) {
                setIsPending(false);
                console.log(isPending);
                setError(null);
                setType("user");
                console.log(type);
            }
        } catch (error) {
            if (!isCancelled) {
                setError(error.message);
                logout();
                setIsPending(false);
            }
        }
    };

    useEffect(() => {
        return () => setIsCancelled(true);
    }, []);

    return { login, isPending, error, type };
};
