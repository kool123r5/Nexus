import { useState, useEffect } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import {googleProvider} from "../firebase/config"
import { useNavigate } from "react-router-dom";

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
  const navigateTo = useNavigate();

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


  const loginWithGoogle = async () => {
    setError(null);
    setIsPending(true);

    try {
      const res = await projectAuth.signInWithPopup(googleProvider);
        
      const userDoc = await projectFirestore.collection('users').doc(res.user.uid).get();
      console.log('hi')

      if (userDoc.exists) {
        // dispatch login action
        console.log('hi')
        dispatch({ type: 'LOGIN', payload: res.user });
      } else {
        // Delete the user authentication object if not registered
        console.log('hi')

        await projectAuth.currentUser.delete();
        console.log('hi')

        throw new Error('User not registered');
      }      

      navigateTo("/");
      location.reload();

      if (!isCancelled && !userFailure) {
        setIsPending(false);
        setError(null);
      }


    } catch (err) {
        console.log('hi')
        console.log(err.message)
      if (isCancelled) {
        setError(err.message);
        
        console.log(error)
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { login, loginWithGoogle, isPending, error };
};
