import { Badge } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { IconDeviceLaptop, IconLink, IconMapPinFilled } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./Activity.css";
import activityList from "../List/activities";
import { useUserDocContext } from "../hooks/useUserDocContext";
import { projectFirestore } from "../firebase/config";
import firebase from "firebase/app";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Activity() {
    const { userDoc } = useUserDocContext();
    const { authIsReady, user } = useAuthContext();

    const isItemInStorage = useCallback(
        (id) => {
            if (userDoc) {
                if (userDoc.activities.includes(id.toString())) {
                    return true;
                } else {
                    return false;
                }
            } else if (authIsReady && !userDoc) {
                return "No user";
            } else if (!authIsReady) {
                return false;
            }
        },
        [authIsReady, userDoc]
    );

    const { id } = useParams();
    const [isActivityAdded, setIsActivityAdded] = useState(isItemInStorage(id));

    useEffect(() => {
        setIsActivityAdded(isItemInStorage(id));
    }, [isItemInStorage, id, authIsReady]);

    const activityDocument = activityList.filter((data) => data.id == id)[0];

    const { width } = useViewportSize();

    useEffect(() => {
        const prevTitle = document.title;
        if (activityDocument) {
            document.title = activityDocument.title;
        }

        return () => {
            document.title = prevTitle;
        };
    }, [activityDocument]);

    const handleRemove = async () => {
        const activities = JSON.parse(localStorage.getItem("activitiesAdded")) || [];
        const indexOfId = activities.indexOf(id);
        activities.splice(indexOfId, 1);
        if (isItemInStorage(id)) {
            projectFirestore
                .collection("users")
                .doc(user.uid)
                .update({
                    activities: firebase.firestore.FieldValue.arrayRemove(id),
                });
            setIsActivityAdded(false);
        }
    };

    const handleAdd = () => {
        if (!isItemInStorage(id)) {
            projectFirestore
                .collection("users")
                .doc(user.uid)
                .update({
                    activities: firebase.firestore.FieldValue.arrayUnion(id),
                });
            setIsActivityAdded(true);
        }
    };

    if (activityDocument == undefined) {
        return <div className="errorDiv">We couldn&apos;t find that activity</div>;
    }

    return (
        <>
            <Navbar />
            <>
                {activityDocument && (
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

                            {activityDocument && (
                                <div className="form-div">
                                    {userDoc && authIsReady && !isActivityAdded && (
                                        <button id="btn" onClick={handleAdd}>
                                            Add Activity to Profile
                                        </button>
                                    )}
                                    {authIsReady && userDoc && isActivityAdded && (
                                        <button id="btn" onClick={handleRemove}>
                                            Remove Activity
                                        </button>
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
