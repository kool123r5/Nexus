import { Badge } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { IconDeviceLaptop, IconLink, IconMapPinFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useDocument } from "../hooks/useDocument";
import "./Activity.css";

export default function Activity() {
    const isItemInLocalStorage = (id) => {
        if (localStorage.getItem("activitiesAdded") == null) {
            return false;
        }
        if (JSON.parse(localStorage.getItem("activitiesAdded").length == 0)) {
            return false;
        }
        return JSON.parse(localStorage.getItem("activitiesAdded")).includes(id);
    };

    const { id } = useParams();
    const [isActivityAdded, setIsActivityAdded] = useState(isItemInLocalStorage(id));

    const { document: activityDocument, error } = useDocument("activities", id);
    if (error) console.log(error);

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
        if (isItemInLocalStorage(id)) {
            localStorage.setItem("activitiesAdded", JSON.stringify(activities));
            setIsActivityAdded(false);
        }
    };

    const handleAdd = () => {
        const activities = JSON.parse(localStorage.getItem("activitiesAdded")) || [];
        if (!isItemInLocalStorage(id)) {
            localStorage.setItem("activitiesAdded", JSON.stringify([...activities, id]));
            setIsActivityAdded(true);
        }
    };

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
                                    {!isActivityAdded ? (
                                        <button id="btn" onClick={handleAdd}>
                                            Add Activity to List
                                        </button>
                                    ) : (
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
