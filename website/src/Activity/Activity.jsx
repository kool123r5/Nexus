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
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activityRemoved, setActivityRemoved] = useState(false);
  console.log(user)
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const { document, error } = useDocument("activities", id);
  const newActivity = {
    activity: projectFirestore.doc(`activities/${id}`),
    startDate: new Date(),
    endDate: null,
    comment: null,
    rating: null,
    completed: "Pending",
  };
  const userDoc = useDocument("users", user.uid);


  useEffect(() => {
    const fetchUpdatedData = async () => {
      const updatedUserDoc = await projectFirestore.collection("users").doc(user.uid).get();
      const updatedActivities = updatedUserDoc.data().activities || [];
      
      // Find the updated activity in the array
      const updatedActivity = updatedActivities.find(
        (activityDoc) =>
          activityDoc.activity._delegate._key.path.segments.at(-1) === id
      );
  
      // Display the updated details
      if (updatedActivity) {
        setRating(updatedActivity.rating);
        setComment(updatedActivity.comment);
      }
    };
  
    if (formSubmitted) {
      fetchUpdatedData();
    }
  }, [formSubmitted, id, user.uid]);



  useEffect(() => {
    if (userDoc.document != null) {
      const activities = userDoc.document.activities || [];
      console.log(activities);
      activities.forEach((activityDoc) => {
        console.log(activityDoc)
        if (
          activityDoc["activity"]["_delegate"]["_key"]["path"]["segments"].at(
            -1
          ) ==
          newActivity["activity"]["_delegate"]["_key"]["path"]["segments"].at(
            -1
          )
        && activityDoc.completed=="Completed") {
          setFormSubmitted(true);
        }
      });
    }
  }, [userDoc]);
  useEffect(() => {
    if (userDoc.document != null) {
      const activities = userDoc.document.activities || [];
      console.log(activities);
      activities.forEach((activityDoc) => {
        if (
          activityDoc["activity"]["_delegate"]["_key"]["path"]["segments"].at(
            -1
          ) ==
          newActivity["activity"]["_delegate"]["_key"]["path"]["segments"].at(
            -1
          )
        ) {
          setDisabled(true);
          console.log(disabled);
        }
      });
    }
  }, [userDoc]);
  const handleComplete = (e) => {
    e.preventDefault();
    const activities = userDoc.document.activities
    const updatedActivities = activities.map((activityDoc) => {
      if (
        activityDoc["activity"]["_delegate"]["_key"]["path"]["segments"].at(
          -1
        ) ===
        newActivity["activity"]["_delegate"]["_key"]["path"]["segments"].at(-1)
      ) {
        return {
          ...activityDoc,
          endDate: new Date(),
          rating: parseInt(rating),
          comment: comment,
          completed: "Completed",
        };
      }
      return activityDoc;
    });

    // Update the user's document with the updated activities array
    projectFirestore.collection("users").doc(user.uid).update({
      activities: updatedActivities,
    });
    setFormSubmitted(true)
  };

  const handleRemove = async () => {
    const activities = userDoc.document.activities || [];

    try {
      // Remove the activity from the user's document
      const updatedActivities = activities.filter(
        (activityDoc) =>
          activityDoc.activity._delegate._key.path.segments.at(-1) !== id
      );
  
      await projectFirestore.collection("users").doc(user.uid).update({
        activities: updatedActivities,
      });
  
      setActivityRemoved(true);
      setText("Activity removed successfully");
      window.location.reload() 
    } catch (error) {
      console.error("Error removing activity:", error);
      // Handle error if needed
    }
  };
  
  const handleClick = () => {
    const activities = userDoc.document.activities || [];

    // Create a new activity object with the required structure
   
    console.log(activities);

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

            {!disabled && (
              <button id="btn" onClick={handleClick} disabled={disabled}>
                {text}
              </button>
            )}

            {disabled && !activityRemoved && (
              <button id="btn" onClick={handleRemove} >
                Remove Activity
              </button>
            )}

            {disabled && !formSubmitted && (
              <div>
                <form onSubmit={handleComplete}>
                  <label>
                    Rating:
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      required
                    />
                  </label>
                  <br />

                  <label>
                    Comment:
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                  </label>
                  <br />

                  <button type="submit">Complete Activity</button>
                </form>
              </div>
            )}

            {formSubmitted && disabled && (<div>
                <h6>Your Ratings and comment:</h6>
                <p>Rating: {rating}</p>
                <p>Comment: {comment}</p>
                </div>)}
          </div>
        )}
      </div>
    </>
  );
}
