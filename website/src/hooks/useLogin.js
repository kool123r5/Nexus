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


            // dispatch login action

           
            dispatch({ type: "LOGIN", payload: res.user });
            
        
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

    return { login, isPending, error };
};
