import { useState } from "react";
import { projectAuth } from "../firebase/config";
import Navbar from "../Navbar/Navbar";
import "./PasswordReset.css";
import { TextInput } from "@mantine/core";
import validator from "email-validator";
import { Toaster, toast } from "sonner";

export default function PasswordReset() {
    const [email, setEmail] = useState(null);
    const [sent, setSent] = useState(false);
    const [err, setErr] = useState(null);

    const sendPasswordReset = async () => {
        if (!validator.validate(email)) {
            toast.error("Please enter a valid email");
            return;
        }
        try {
            await projectAuth.sendPasswordResetEmail(email);
            toast.success("Successfully sent the password reset email, check your inbox");
            setSent(true);
        } catch (err) {
            setSent(false);
            setErr(err.message);
            toast.error(err.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className="passwordResetContainer">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "70vw",
                    }}
                >
                    <TextInput
                        placeholder="Email"
                        label="Enter your email"
                        size="xl"
                        id="emailPwResetInput"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <br />
                <button onClick={sendPasswordReset}>Get Password Reset Link</button>
                <br />
                {sent && <p>Check your email to reset your password.</p>}
                {err && <p style={{ color: "red" }}>{err}</p>}
            </div>
            <Toaster />
        </>
    );
}
