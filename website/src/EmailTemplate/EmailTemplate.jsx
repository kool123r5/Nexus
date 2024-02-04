import React, { useEffect, useState } from "react";
import "./EmailTemplate.css";
import { projectAuth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

export default function EmailTemplate() {
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isEmailVerifiedErr, setIsEmailVerifiedErr] = useState("");
    const queryString = window.location.search;
    const urlSearchParams = new URLSearchParams(queryString);
    const actionCode = urlSearchParams.get("oobCode");

    const navigate = useNavigate();

    useEffect(() => {
        if (actionCode == null) {
            navigate("/");
        }
    }, [actionCode, navigate]);

    const handleVerifyEmail = (auth, actionCode) => {
        auth.applyActionCode(actionCode)
            .then((resp) => {
                console.log(resp);
                setIsEmailVerified(true);
                setIsEmailVerifiedErr("");
            })
            .catch((error) => {
                setIsEmailVerified(false);
                setIsEmailVerifiedErr(error.message);
            });
    };

    actionCode && handleVerifyEmail(projectAuth, actionCode);

    return (
        <>
            {actionCode && (
                <div>
                    {isEmailVerified && isEmailVerifiedErr == "" && <>Email verified successfully</>}
                    {!isEmailVerified && isEmailVerifiedErr == "" && <>Verify your email!</>}
                    {isEmailVerifiedErr != "" && <>Something went wrong: {isEmailVerifiedErr}</>}
                </div>
            )}
        </>
    );
}
