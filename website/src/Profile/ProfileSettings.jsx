import { useState } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useDocument } from "../hooks/useDocument";
import Navbar from "../Navbar/Navbar";
import "./ProfileSettings.css";
import firebase from "firebase/app";

export default function ProfileSettings() {
    const { document, error } = useDocument("users", projectAuth.currentUser.uid);

    const [newEmail, setNewEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [isEmailChangeSent, setIsEmailChangeSent] = useState(false);
    const [errorWhileUpdatingEmail, setErrorWhileUpdatingEmail] = useState("");

    const [changedPassword, setChangedPassword] = useState(null);
    const [confirmChangedPassword, setConfirmChangedPassword] = useState(null);
    const [currentPassword, setCurrentPassword] = useState(null);
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);
    const [errorWhileUpdatingPassword, setErrorWhileUpdatingPassword] = useState("");

    const changeEmail = async () => {
        try {
            // this works
            const credential = firebase.auth.EmailAuthProvider.credential(projectAuth.currentUser.email, password);

            // this doesn't
            // const credential = emailProvider.credential(projectAuth.currentUser.email, password);

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
            const credential = firebase.auth.EmailAuthProvider.credential(projectAuth.currentUser.email, currentPassword);
            await projectAuth.currentUser.reauthenticateWithCredential(credential);
            await projectAuth.currentUser.updatePassword(changedPassword);
            setIsPasswordChanged(true);
            setErrorWhileUpdatingPassword("");
        } catch (err) {
            setErrorWhileUpdatingPassword(err);
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
                </>
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
}
