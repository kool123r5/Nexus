import "./Activity.css";
import { useParams } from "react-router-dom";
import { useDocument } from "../hooks/useDocument";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";
import { useEffect } from "react";
import { projectFirestore } from "../firebase/config";
import Navbar from "../Navbar/Navbar";

export default function Activity() {
    const { id } = useParams();
    const { user, authIsReady } = useAuthContext();
    const [text, setText] = useState("Add Activity");
    const [disabled, setDisabled] = useState(false);

    const { document, error } = useDocument("activities", id);

    const userDoc = useDocument("users", user.uid);

    const handleClick = () => {
        const activities = userDoc.document.activities || [];

        // Create a new activity object with the required structure
        const newActivity = {
            activity: projectFirestore.doc(`activities/${id}`),
            startDate: new Date(),
            endDate: null,
            comment: null,
            rating: null,
            completed: "Pending",
        };

        console.log(activities);
        activities.forEach((activityDoc) => {
            if (
                activityDoc["activity"]["_delegate"]["_key"]["path"]["segments"].at(-1) ==
                newActivity["activity"]["_delegate"]["_key"]["path"]["segments"].at(-1)
            ) {
                // here there should be a way to realize the user added this activity previously
                // and don't let them re-add it
                // i have no idea how to do this
                // i tried using state and stuff doesn't work so idk
            }
        });

        // Update the activities array in the user's document
        const updatedActivities = [...activities, newActivity];

        // Update the user's document with the new activities array
        projectFirestore.collection("users").doc(user.uid).update({
            activities: updatedActivities,
        });

        setText("Successfully added activity");
        setDisabled(true);
    };

    return (
        <>
            <Navbar />
            <div>
                Not sure what goes here for now, so just keeping this:
                {document && userDoc && user && (
                    <div className="fullActivity">
                        <h2>Posted by User: {document.username}</h2>
                        <h1>Title: {document.title}</h1>
                        <h3>Text: {document.text}</h3>
                        <p>{userDoc.document.email}</p>
                        <p>{user.uid}</p>

                        <button id="btn" onClick={handleClick} disabled={disabled}>
                            {text}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
