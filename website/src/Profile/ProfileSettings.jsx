import firebase from "firebase/app";
import { useState } from "react";
import Navbar from "../Navbar/Navbar";
import { projectAuth, projectFirestore, projectStorage } from "../firebase/config";
import getDefaultPfp from "../functions/getDefaultPfp";
import resizeImg from "../functions/resizeImg";
import { useUserDocContext } from "../hooks/useUserDocContext";
import "./ProfileSettings.css";

export default function ProfileSettings() {
    const { userDoc: document, error } = useUserDocContext();

    const [newEmail, setNewEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [isEmailChangeSent, setIsEmailChangeSent] = useState(false);
    const [errorWhileUpdatingEmail, setErrorWhileUpdatingEmail] = useState("");

    const [changedPassword, setChangedPassword] = useState("");
    const [confirmChangedPassword, setConfirmChangedPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);
    const [errorWhileUpdatingPassword, setErrorWhileUpdatingPassword] = useState("");

    const [pfp, setPfp] = useState(null);
    const [pfpChanged, setPfpChanged] = useState("");

    const changeEmail = async () => {
        try {
            // this works
            const credential = firebase.auth.EmailAuthProvider.credential(projectAuth.currentUser.email, password);

            await projectAuth.currentUser.reauthenticateWithCredential(credential);
            await projectAuth.currentUser.verifyBeforeUpdateEmail(newEmail);
            setIsEmailChangeSent(true);
            setErrorWhileUpdatingEmail("");

            // we should wait till the user verifies the email change for this, just wanted to test
            await projectFirestore.collection("users").doc(projectAuth.currentUser.uid).update({
                email: newEmail,
            });
        } catch (err) {
            setErrorWhileUpdatingEmail(err.message);
        }
    };

    const changePassword = async () => {
        try {
            // TODO: if the user used google signup initially, reauthenticate with popup before you can change pw
            if (changedPassword != confirmChangedPassword) {
                setErrorWhileUpdatingPassword("Passwords do not match");
                return;
            }

            if (document.authProviders.length == 1 && document.authProviders[0] == "google") {
                console.log(projectAuth.currentUser.email);
                const idToken = await projectAuth.currentUser.getIdToken();
                const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);
                await projectAuth.currentUser.reauthenticateWithCredential(googleCredential);

                const credential = firebase.auth.EmailAuthProvider.credential(
                    projectAuth.currentUser.email,
                    changedPassword
                );
                await projectAuth.currentUser.linkWithCredential(credential);

                await projectFirestore
                    .collection("users")
                    .doc(projectAuth.currentUser.uid)
                    .update({
                        authProviders: firebase.firestore.FieldValue.arrayUnion("email"),
                    });
                setIsPasswordChanged(true);
                setErrorWhileUpdatingPassword("");
                return;
            }
            const credential = firebase.auth.EmailAuthProvider.credential(projectAuth.currentUser.email, currentPassword);
            await projectAuth.currentUser.reauthenticateWithCredential(credential);
            await projectAuth.currentUser.updatePassword(changedPassword);
            setIsPasswordChanged(true);
            setErrorWhileUpdatingPassword("");
        } catch (err) {
            setErrorWhileUpdatingPassword(err);
        }
    };

    const changePfp = async () => {
        try {
            let url = null;
            if (pfp != null) {
                const pfpResized = await resizeImg(pfp);
                const uploadPath = `pfp/${projectAuth.currentUser.uid}`;
                const blob = await fetch(pfpResized).then((res) => res.blob());
                const profilePicResized = await projectStorage.ref(uploadPath).put(blob);
                url = await profilePicResized.ref.getDownloadURL();
            }

            await projectAuth.currentUser.updateProfile({
                photoURL: url,
            });

            await projectFirestore.collection("users").doc(projectAuth.currentUser.uid).update({
                pfp: url,
            });

            setPfpChanged("Changed Profile Picture");
        } catch (error) {
            setPfpChanged(error);
        }
    };

    const removePfp = async () => {
        try {
            await projectStorage.ref(`pfp/${projectAuth.currentUser.uid}`).delete();

            await projectAuth.currentUser.updateProfile({
                photoURL: null,
            });

            await projectFirestore.collection("users").doc(projectAuth.currentUser.uid).update({
                pfp: null,
            });

            setPfpChanged("Removed Profile Picture");
        } catch (error) {
            setPfpChanged(error);
        }
    };

    return (
        <>
            <Navbar />
            {error && <p>Error when fetching settings.</p>}
            {!error && document ? (
                <>
                    <>
                        <p>Current Email: {document.email}</p>
                        <input type="email" placeholder="Change Email" onChange={(e) => setNewEmail(e.target.value)} />
                        <input
                            type="password"
                            placeholder="Password to confirm change"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button onClick={changeEmail}>Change Email</button>
                        {isEmailChangeSent && !errorWhileUpdatingEmail ? (
                            <p>Check the new email to verify the change.</p>
                        ) : (
                            <></>
                        )}
                        {errorWhileUpdatingEmail && (
                            <p>Sorry, there was an error while updating your email: {errorWhileUpdatingEmail}</p>
                        )}
                    </>
                    <br />
                    <>
                        <input
                            type="password"
                            placeholder="New Password"
                            onChange={(e) => setChangedPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            onChange={(e) => setConfirmChangedPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Current Password"
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <button onClick={changePassword}>Change Password</button>
                        {isPasswordChanged && !errorWhileUpdatingPassword ? <p>Password changed successfully</p> : <></>}
                        {errorWhileUpdatingPassword && (
                            <p>
                                Sorry, there was an error while updating your password:{" "}
                                {errorWhileUpdatingPassword.toString()}
                            </p>
                        )}
                    </>
                    <br />
                    <br />
                    <>
                        <p>Current profile picture: </p>
                        {document && document.pfp != null ? (
                            <img src={document.pfp} height={150} width={150} />
                        ) : (
                            <img src={getDefaultPfp(document.displayName)} height={150} width={150} />
                        )}
                        <label>
                            Profile Picture: <input type={"file"} onChange={(e) => setPfp(e.target.files[0])}></input>
                        </label>
                        <button onClick={changePfp}>Change Profile Picture</button>
                        <button onClick={removePfp}>Remove Profile Picture</button>
                        <p>{pfpChanged}</p>
                    </>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
}
