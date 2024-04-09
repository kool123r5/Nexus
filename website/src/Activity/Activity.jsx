import { Badge } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { IconDeviceLaptop, IconLink, IconMapPinFilled, IconMoneybag } from "@tabler/icons-react";
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
                            <div className="byUsername">
                                <div>
                                    <span className="by">By </span> <span className="username">{activityDocument.host}</span>
                                </div>
                                <div>
                                    {activityDocument.type != "unknown" && (
                                        <span className="username">{activityDocument.type[0]}</span>
                                    )}
                                </div>
                            </div>
                            <h2 className="title">
                                {activityDocument.title}
                                <div className="badgeWrapper">
                                    {activityDocument.tags != "unknown" &&
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
                                {activityDocument.mode.trim() == "inPerson" && (
                                    <div className="location">
                                        <IconMapPinFilled className="mapIcon" />
                                        <p className="onlineOrLocInfo">{activityDocument.location.trim()}</p>
                                    </div>
                                )}
                                {activityDocument.mode.trim() == "remote" && (
                                    <div className="online">
                                        <IconDeviceLaptop className="laptopIcon" />
                                        <p className="onlineOrLocInfo">Online</p>
                                    </div>
                                )}
                                {activityDocument.mode.trim() == "hybrid" && (
                                    <div className="online">
                                        <p className="onlineOrLocInfo">
                                            Both Online and In {activityDocument.location.trim()}
                                        </p>
                                    </div>
                                )}
                                {activityDocument.cost[0] ? (
                                    <>
                                        {activityDocument.cost[1] == "unknown" || activityDocument.cost[2] == "unknown" ? (
                                            <p className="cost">
                                                <IconMoneybag color="#02aa0a" />
                                                Costs Money
                                            </p>
                                        ) : (
                                            <p className="cost">
                                                <IconMoneybag color="#02aa0a" />
                                                Costs {activityDocument.cost[1]} {activityDocument.cost[2]}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p
                                        className="cost"
                                        style={{
                                            color: "#02aa0a",
                                            fontWeight: 500,
                                        }}
                                    >
                                        Free Activity
                                    </p>
                                )}
                                {activityDocument.paid[0] ? (
                                    <>
                                        {activityDocument.paid[1] == "unknown" || activityDocument.paid[2] == "unknown" ? (
                                            <p
                                                className="cost"
                                                style={{
                                                    color: "#02aa0a",
                                                    fontWeight: 500,
                                                }}
                                            >
                                                Pays Entrant
                                            </p>
                                        ) : (
                                            <p
                                                className="cost"
                                                style={{
                                                    color: "#02aa0a",
                                                    fontWeight: 500,
                                                }}
                                            >
                                                Pays {activityDocument.paid[1]} {activityDocument.paid[2]}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p
                                        className="cost"
                                        style={{
                                            fontWeight: 500,
                                        }}
                                    >
                                        Does not pay
                                    </p>
                                )}
                                {activityDocument.selective ? (
                                    <div className="cost username">Selective opportunity</div>
                                ) : (
                                    <div className="cost username">Not Selective</div>
                                )}
                            </div>
                            <h4 className="text">{activityDocument.text}</h4>
                            <br />
                            {activityDocument.requirements != "unknown" && (
                                <div className="requirementsDiv">
                                    Requirements:{" "}
                                    {activityDocument.demographics != "unknown" &&
                                        activityDocument.demographics[0] != "All Students" &&
                                        activityDocument.demographics.map((demographic) => {
                                            return `${demographic}. `;
                                        })}
                                    {activityDocument.requirements}
                                </div>
                            )}
                            <br />
                            <div className="ageAndGradeDiv">
                                {activityDocument.age.length != 0 && activityDocument.age != "unknown" && (
                                    <p
                                        style={{
                                            margin: 0,
                                        }}
                                    >
                                        Available for ages <span className="username">{activityDocument.age[0]}</span> to{" "}
                                        <span className="username">
                                            {activityDocument.age[activityDocument.age.length - 1]}
                                        </span>
                                    </p>
                                )}
                                {activityDocument.gradeRange != "unknown" && activityDocument.gradeRange.length != 0 && (
                                    <p style={{ margin: 0 }}>
                                        For{" "}
                                        {activityDocument.gradeRange.map((grade, index) => {
                                            return (
                                                <span className="username" key={index}>
                                                    {index != activityDocument.gradeRange.length - 1
                                                        ? `${grade.trim()}s, `
                                                        : `${grade.trim()}s`}
                                                </span>
                                            );
                                        })}
                                    </p>
                                )}
                            </div>
                            <br />
                            {activityDocument.deadline != "unknown" && (
                                <div>
                                    Deadline: <span className="username">{activityDocument.deadline.trim()}</span>
                                </div>
                            )}
                            {activityDocument.startDate != "unknown" && activityDocument.endDate != "unknown" && (
                                <div>
                                    This activity goes on from <span className="username">{activityDocument.startDate}</span>{" "}
                                    to <span className="username">{activityDocument.endDate}</span>
                                </div>
                            )}
                            {activityDocument.duration != "unknown" &&
                                activityDocument.startDate == "unknown" &&
                                activityDocument.endDate == "unknown" && (
                                    <div>
                                        This activity goes on for
                                        <span className="username"> {activityDocument.duration}</span>
                                    </div>
                                )}
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
                            <br />
                            <br />
                            {activityDocument && (
                                <a href="mailto:TODOADDEMAILHERE@gmail.com">
                                    <button className="reportErrorBtn">Out of date? Errors? Anything we should add?</button>
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </>
        </>
    );
}
