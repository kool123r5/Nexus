// useGoogleSignIn.js

import { useState } from "react";
import { projectAuth, googleProvider,projectFirestore } from "../firebase/config"; // Make sure to replace '../firebase' with the correct path to your Firebase configuration
import { useNavigate } from "react-router-dom";


const useGoogleSignIn = () => {
  const [error2, setError] = useState(null);
  const navigateTo = useNavigate();


  const signInWithGoogle = async () => {
    try {
      const res=await projectAuth.signInWithPopup(googleProvider).catch((err) => {
        setError(err.message);
      });;

      const displayName=res.user.displayName
      const email=res.user.email


      const userDoc = await projectFirestore.collection('users').doc(res.user.uid).get();

      if(userDoc.exists){
        throw new Error('User already registered. You have been automatically logged in.');
      }
      else {await projectFirestore.collection("users").doc(res.user.uid).set({
        displayName,
        email,
      });}

      
      navigateTo("/");
      location.reload();
      
    } catch (err) {
      setError(err.message);
    }
  };

  return { signInWithGoogle, error2 };
};

export default useGoogleSignIn;
