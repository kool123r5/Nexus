import "./Activity.css";
import { useParams } from "react-router-dom";
import { useDocument } from "../hooks/useDocument";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";
import { useEffect } from "react";
import { projectFirestore, timestamp } from "../firebase/config";
import Navbar from "../Navbar/Navbar";
import { IconMapPinFilled, IconLink } from "@tabler/icons-react";
import { Badge } from "@mantine/core";

export default function Activity() {
    const { id } = useParams();
    const { user, authIsReady } = useAuthContext();
    const [text, setText] = useState("Add Activity");
    const [disabled, setDisabled] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [activityRemoved, setActivityRemoved] = useState(false);
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState(null);

    const { document, error } = useDocument("activities", id);
    if (error) console.log(error);

    const newActivity = {
        activity: projectFirestore.doc(`activities/${id}`),
        startDate: timestamp.now(),
        endDate: null,
        comment: null,
        rating: null,
        completed: "Pending",
    };
    const userDoc = useDocument("users", user.uid);

    useEffect(() => {
        const fetchUpdatedData = async () => {
            const updatedActivities = userDoc.document.activities || [];
            console.log("Updated activities", updatedActivities);
            // Find the updated activity in the array
            const updatedActivity = updatedActivities.find(
                (activityDoc) => activityDoc.activity._delegate._key.path.segments.at(-1) === id
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
    }, [formSubmitted, id, user.uid, userDoc]);

    useEffect(() => {
        if (userDoc.document != null) {
            const activities = userDoc.document.activities || [];
            activities.forEach((activityDoc) => {
                console.log(activityDoc);
                if (
                    activityDoc["activity"]["_delegate"]["_key"]["path"]["segments"].at(-1) ==
                        newActivity["activity"]["_delegate"]["_key"]["path"]["segments"].at(-1) &&
                    activityDoc.completed == "Completed"
                ) {
                    setFormSubmitted(true);
                }
            });
        }
    }, [userDoc]);

    useEffect(() => {
        if (userDoc.document != null) {
            const activities = userDoc.document.activities || [];
            activities.forEach((activityDoc) => {
                if (
                    activityDoc["activity"]["_delegate"]["_key"]["path"]["segments"].at(-1) ==
                    newActivity["activity"]["_delegate"]["_key"]["path"]["segments"].at(-1)
                ) {
                    setDisabled(true);
                    console.log(disabled);
                }
            });
        }
    }, [userDoc]);

    const handleComplete = (e) => {
        e.preventDefault();
        const activities = userDoc.document.activities;
        const updatedActivities = activities.map((activityDoc) => {
            if (
                activityDoc["activity"]["_delegate"]["_key"]["path"]["segments"].at(-1) ===
                newActivity["activity"]["_delegate"]["_key"]["path"]["segments"].at(-1)
            ) {
                return {
                    ...activityDoc,
                    endDate: timestamp.now(),
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
        setFormSubmitted(true);
    };

    const handleRemove = async () => {
        const activities = userDoc.document.activities || [];

        try {
            // Remove the activity from the user's document
            const updatedActivities = activities.filter(
                (activityDoc) => activityDoc.activity._delegate._key.path.segments.at(-1) !== id
            );

            await projectFirestore.collection("users").doc(user.uid).update({
                activities: updatedActivities,
            });

            setActivityRemoved(true);
            setText("Add Activity");
            setDisabled(false);
            setFormSubmitted(false);
            setComment(null);
            setRating(null);
        } catch (error) {
            console.error("Error removing activity:", error);
            // Handle error if needed
        }
    };

    const handleClick = () => {
        const activities = userDoc.document.activities || [];

        // Update the activities array in the user's document
        const updatedActivities = [...activities, newActivity];

        // Update the user's document with the new activities array
        projectFirestore.collection("users").doc(user.uid).update({
            activities: updatedActivities,
        });

        setText("Successfully added activity");
        setDisabled(true);
        setActivityRemoved(false);
    };

    return (
        <>
            <Navbar />
            <>
                {document && userDoc && user && (
                    <div className="fullActivity">
                        {document.image && (
                            <div className="imageDiv">
                                <img className="img" src={document.image} alt={document.title + "Image"} />
                            </div>
                        )}
                        <div className="details">
                            <h3 className="byUsername">
                                <span className="by">By </span> <span className="username">{document.username}</span>
                            </h3>
                            <h2 className="title">
                                {document.title}
                                {document.category.map((c) => {
                                    <Badge color="#ff6d00">{c}</Badge>;
                                })}
                            </h2>
                            <h4 className="text">{document.text}</h4>
                            <h4 className="website">
                                <a className="link" target="_blank" rel="noreferrer" href={document.website}>
                                    <IconLink className="websiteIcon" />
                                    Website
                                </a>
                            </h4>
                            {document.inPerson && (
                                <div className="location">
                                    <IconMapPinFilled className="mapIcon" />
                                    <p>{document.location}</p>
                                </div>
                            )}

                            {document && !document.selective && (
                                <>
                                    {!disabled && (
                                        <button id="btn" onClick={handleClick} disabled={disabled}>
                                            {text}
                                        </button>
                                    )}

                                    {disabled && !activityRemoved && (
                                        <button id="btn" onClick={handleRemove}>
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

                                    {formSubmitted && disabled && (
                                        <div>
                                            <h6>Your Ratings and comment:</h6>
                                            <p>Rating: {rating}</p>
                                            <p>Comment: {comment}</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </>
        </>
    );
}
