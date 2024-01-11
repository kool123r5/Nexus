import { useState, useEffect } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useNavigate } from "react-router-dom";

export const useSignup = () => {
    const [isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const navigateTo = useNavigate();

    const signup = async (email, password, confirmPassword, displayName) => {
        setError(null);
        const activities = null;
        setIsPending(true);
        try {
            // signup
            const res = await projectAuth.createUserWithEmailAndPassword(email, password).catch((err) => {
                setError(err.message);
            });

            if (!res) {
                throw new Error("Could not complete signup");
            }

            if (password != confirmPassword) {
                throw new Error("Passwords don't match");
            }

            // sends the user a verification email
            await res.user.sendEmailVerification();

            await res.user.updateProfile({ displayName });

            // create a user document
            await projectFirestore
                .collection("users")
                .doc(res.user.uid)
                .set({
                    displayName,
                    email,
                    authProviders: ["email"],
                    friends: [],
                    friendRequestsSent: [],
                    friendRequestsReceived: [],
                });

            if (!isCancelled) {
                setIsPending(false);
                setError(null);
            }

            navigateTo("/signup2");
            location.reload();
        } catch (err) {
            if (!isCancelled) {
                setError(err.message);
                setIsPending(false);
            }
        }
    };

    useEffect(() => {
        return () => setIsCancelled(true);
    }, []);

    return { signup, error, isPending };
};
