import "./Activity.css";
import { useParams } from "react-router-dom";
import { useDocument } from "../hooks/useDocument";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";
import { useEffect } from "react";
import { projectFirestore } from "../firebase/config";

export default function Activity() {
    const { id } = useParams();
    const {user,authIsReady}=useAuthContext()

    const { document, error } = useDocument("activities", id);

    const userDoc =  useDocument("users", user.uid);
           
        
    const handleClick=()=>{
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

            // Update the activities array in the user's document
            const updatedActivities = [...activities, newActivity];
            console.log('hi')
            // Update the user's document with the new activities array
            projectFirestore.collection("users").doc(user.uid).update({
                activities: updatedActivities,
            });
        
    }


        

    


    return (
        <div>
            Not sure what goes here for now, so just keeping this:
            {document && userDoc && user && (
                <div className="fullActivity">
                    <h2>Posted by User: {document.username}</h2>
                    <h1>Title: {document.title}</h1>
                    <h3>Text: {document.text}</h3>
                    <p>{userDoc.document.email}</p>
                    <p>{user.uid}</p>

                    <button onClick={handleClick}>Add Activity</button>
                </div>
            )}
        </div>
    );
}
