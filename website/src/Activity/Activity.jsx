import { Badge, NumberInput, TextInput } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { IconDeviceLaptop, IconLink, IconMapPinFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { projectFirestore, timestamp } from "../firebase/config";
import { useAuthContext } from "../hooks/useAuthContext";
import { useDocument } from "../hooks/useDocument";
import { useUserDocContext } from "../hooks/useUserDocContext";
import "./Activity.css";

export default function Activity() {
    const { id } = useParams();
    const { user } = useAuthContext();
    const [text, setText] = useState("Add Activity");
    const [disabled, setDisabled] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [activityRemoved, setActivityRemoved] = useState(false);
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState(null);

    const { document: activityDocument, error } = useDocument("activities", id);
    if (error) console.log(error);

    const { width } = useViewportSize();

    const newActivity = {
        activity: projectFirestore.doc(`activities/${id}`),
        startDate: timestamp.now(),
        endDate: null,
        comment: null,
        rating: null,
        completed: "Pending",
    };

    // const userDoc = useDocument("users", user.uid);
    const { userDoc } = useUserDocContext();

    useEffect(() => {
        const prevTitle = document.title;
        if (activityDocument) {
            document.title = activityDocument.title;
        }

        return () => {
            document.title = prevTitle;
        };
    }, [activityDocument]);

    useEffect(() => {
        const fetchUpdatedData = async () => {
            const updatedActivities = userDoc.activities || [];
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
        if (userDoc != null) {
            const activities = userDoc.activities || [];
            activities.forEach((activityDoc) => {
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
        if (userDoc != null) {
            const activities = userDoc.activities || [];
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
    }, [userDoc, disabled]);

    const handleComplete = (e) => {
        e.preventDefault();
        const activities = userDoc.activities;
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
        const activities = userDoc.activities || [];

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
        const activities = userDoc.activities || [];

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
                {activityDocument && userDoc && user && (
                    <div className="fullActivity">
                        {activityDocument.image && width > 950 && (
                            <div className="imageDiv">
                                <img className="img" src={activityDocument.image} alt={activityDocument.title + "Image"} />
                            </div>
                        )}
                        <div className="details">
                            <h3 className="byUsername">
                                <span className="by">By </span> <span className="username">{activityDocument.host}</span>
                            </h3>
                            <h2 className="title">
                                {activityDocument.title}
                                <div className="badgeWrapper">
                                    {activityDocument.tags &&
                                        activityDocument.tags.map((c, index) => {
                                            return (
                                                <Badge className="badge" key={index} color="#ff6d00">
                                                    {c}
                                                </Badge>
                                            );
                                        })}
                                </div>
                            </h2>
                            <div className="otherDetails">
                                <h4 className="website">
                                    <a className="link" target="_blank" rel="noreferrer" href={activityDocument.website}>
                                        <IconLink className="websiteIcon" />
                                        Website
                                    </a>
                                </h4>
                                {/* document in person is null then don't show */}
                                {/* document in person is false then show online */}
                                {/* document in person is true then show location if loc exists, otherwise don't show */}
                                {activityDocument.inPerson == null ||
                                (activityDocument.inPerson == true && activityDocument.location == "") ? (
                                    <></>
                                ) : (
                                    <>
                                        {activityDocument.inPerson ? (
                                            <div className="location">
                                                <IconMapPinFilled className="mapIcon" />
                                                <p className="onlineOrLocInfo">{activityDocument.location}</p>
                                            </div>
                                        ) : (
                                            <div className="online">
                                                <IconDeviceLaptop className="laptopIcon" />
                                                <p className="onlineOrLocInfo">Online</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <h4 className="text">{activityDocument.text}</h4>

                            {activityDocument.anyoneCanJoin && (
                                <div className="form-div">
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
                                                <TextInput
                                                    label="Comment"
                                                    description="Enter a comment"
                                                    placeholder="Comment here"
                                                    onChange={(e) => setComment(e.target.value)}
                                                    required
                                                    value={comment}
                                                />
                                                <NumberInput
                                                    label="Rating"
                                                    description="Enter a rating"
                                                    placeholder="Rating"
                                                    value={rating}
                                                    onChange={(e) => {
                                                        setRating(e);
                                                    }}
                                                    clampBehavior="strict"
                                                    required
                                                    min={0}
                                                    max={5}
                                                />

                                                <button id="btn" type="submit">
                                                    Complete Activity
                                                </button>
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
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </>
        </>
    );
}
