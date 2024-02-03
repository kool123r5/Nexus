import { useState, useEffect } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { projectStorage } from "../firebase/config";
import resizeImg from "../functions/resizeImg";
import { useAuthContext } from "./useAuthContext";

export const useSignupInfo = () => {
    const [isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const navigateTo = useNavigate();
    const { user, authIsReady } = useAuthContext();

    const signup2 = async (age, grade, userLocation, interests, pfp) => {
        console.log(user);

        setError(null);
        const activities = [];

        setIsPending(true);
        try {
            let url = null;
            if (pfp != null) {
                const pfpResized = await resizeImg(pfp);
                const uploadPath = `pfp/${user.uid}`;
                const blob = await fetch(pfpResized).then((res) => res.blob());
                const profilePicResized = await projectStorage.ref(uploadPath).put(blob);

                url = await profilePicResized.ref.getDownloadURL();
            }

            console.log("hi");
            await user.updateProfile({ photoURL: url });
            console.log(user);
            // create a user document
            await projectFirestore.collection("users").doc(user.uid).update({
                age,
                grade,
                userLocation,
                interests,
                activities,
                pfp: url,
                friends: [],
                friendRequestsSent: [],
                friendRequestsReceived: [],
                // authProviders: what to do here? maybe we pass it in as props or smthn idk,
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

    return { signup2, error, isPending };
};
