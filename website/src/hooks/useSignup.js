import { useState, useEffect } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { projectStorage } from "../firebase/config";
import resizeImg from "../functions/resizeImg";

export const useSignup = () => {
    const [isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const navigateTo = useNavigate();

    const signup = async (email, password, confirmPassword, displayName, age, grade, userLocation, interests, pfp) => {
        setError(null);
        const activities=null
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

            let url = null;
            if (pfp != null) {
                const pfpResized = await resizeImg(pfp);
                const uploadPath = `pfp/${res.user.uid}`;
                const blob = await fetch(pfpResized).then((res) => res.blob());
                const profilePicResized = await projectStorage.ref(uploadPath).put(blob);
                url = await profilePicResized.ref.getDownloadURL();
            }

            // sends the user a verification email
            await res.user.sendEmailVerification();

            await res.user.updateProfile({ displayName, photoURL: url });

            // create a user document
            await projectFirestore.collection("users").doc(res.user.uid).set({
                displayName,
                email,
                age,
                grade,
                userLocation,
                interests,
                activities,
                pfp: url,
                friends: [],
            });

            if (!isCancelled) {
                setIsPending(false);
                setError(null);
            }

            navigateTo("/");
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
