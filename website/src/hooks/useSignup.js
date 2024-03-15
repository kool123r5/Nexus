import { useState, useEffect } from "react";
import { projectAuth, projectFirestore, projectStorage } from "../firebase/config";
import resizeImg from "../functions/resizeImg";
import hasNumber from "../functions/hasNumber";

export const useSignup = () => {
    const [isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);

    const signup = async (email, password, confirmPassword, displayName, age, grade, loc, pfp, interests) => {
        setError(null);
        setIsPending(true);

        try {
            if (password.length < 6) {
                setError("Your password must be at least 6 characters long!");
                return;
            }

            if (!hasNumber(password)) {
                setError("Your password must have at least 1 number!");
                return;
            }

            if (password != confirmPassword) {
                // throw new Error("Passwords don't match");
                setError("Passwords don't match!");
                return;
            }

            if (displayName == "") {
                setError("Please enter a display name!");
                return;
            }

            if (interests.length == 0) {
                setError("Please choose some interests!");
                return;
            }

            const res = await projectAuth.createUserWithEmailAndPassword(email, password);

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
                    postsAdded: [],
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
                console.log(err);
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
