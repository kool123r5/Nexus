import { useState, useEffect } from "react";
import { projectAuth, projectFirestore, projectStorage } from "../firebase/config";
import resizeImg from "../functions/resizeImg";

export const useSignup = () => {
    const [isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);

    const signup = async (email, password, confirmPassword, displayName, age, grade, loc, pfp, interests) => {
        setError(null);
        setIsPending(true);
        try {
            // signup
            const res = await projectAuth.createUserWithEmailAndPassword(email, password).catch((err) => {
                setError(err.message);
                console.log(err);
            });

            if (!res) {
                throw new Error("Could not complete signup");
            }

            if (password != confirmPassword) {
                throw new Error("Passwords don't match");
            }

            // sends the user a verification email
            await res.user.sendEmailVerification();

            let url = null;
            if (pfp != null) {
                const pfpResized = await resizeImg(pfp);
                const uploadPath = `pfp/${res.user.uid}`;
                const blob = await fetch(pfpResized).then((res) => res.blob());
                const profilePicResized = await projectStorage.ref(uploadPath).put(blob);

                url = await profilePicResized.ref.getDownloadURL();
            }

            await res.user.updateProfile({ displayName: displayName, photoURL: url });
            console.log(res.user);
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
                    age,
                    grade,
                    location: loc,
                    pfp: url,
                    interests,
                });

            if (!isCancelled) {
                setIsPending(false);
                setError(null);
            }

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
