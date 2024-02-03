import { useState } from "react";
import { projectAuth } from "../firebase/config";
import Navbar from "../Navbar/Navbar";
import "./PasswordReset.css";

export default function PasswordReset() {
    const [email, setEmail] = useState(null);
    const [sent, setSent] = useState(false);

    const sendPasswordReset = async () => {
        await projectAuth.sendPasswordResetEmail(email);
        setSent(true);
    };

    return (
        <div>
            <Navbar />
            <label>
                Email: <input type="email" onChange={(e) => setEmail(e.target.value)}></input>
            </label>
            <br />
            <button onClick={sendPasswordReset}>Get Password Reset Link</button>
            <br />
            {sent && <p>Check your email to reset your password.</p>}
        </div>
    );
}
