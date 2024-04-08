import firebase from "firebase/app";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useCollection } from "../hooks/useCollection.js";
import { useUserDocContext } from "../hooks/useUserDocContext";
import "./Profile.css";
import { Divider } from "@mantine/core";
import { IconFriends, IconPencil } from "@tabler/icons-react";
import { Toaster, toast } from "sonner";
import getDefaultPfp from "../functions/getDefaultPfp.js";
import { useLogout } from "../hooks/useLogout.js";
import activityList from "../List/activities.js";

export default function Profile() {
    const { id } = useParams();
    const { documents: currentIdDocument, error } = useCollection("users", ["username", "==", id], null, 1);
    const { userDoc } = useUserDocContext();
    const [activities, setActivities] = useState(null);
    const navigate = useNavigate();
    const { logout } = useLogout();

    useEffect(() => {
        if (userDoc && userDoc.friendRequestsReceived && userDoc.friendRequestsReceived.length != 0) {
            userDoc.friendRequestsReceived.forEach((friendReqId) => {
                toast.success(
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            alignItems: "center",
                        }}
                    >
                        <IconFriends color="white" />
                        <p
                            style={{
                                color: "white",
                                textAlign: "center",
                                fontSize: "large",
                                margin: "5px",
                            }}
                        >
                            <Link
                                style={{
                                    color: "#ff6d00",
                                }}
                                to={`/profile/${friendReqId}`}
                            >
                                This user
                            </Link>
                            &nbsp;has sent you a friend request
                        </p>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "2px",
                                width: "100%",
                            }}
                        >
                            <button
                                className="constructiveFriendBtn friendBtn"
                                style={{
                                    width: "50%",
                                }}
                                onClick={() => acceptFriendRequest(friendReqId)}
                            >
                                Accept
                            </button>
                            <button
                                className="destructiveFriendBtn friendBtn"
                                style={{
                                    width: "50%",
                                }}
                                onClick={() => rejectFriendRequest(friendReqId)}
                            >
                                Reject
                            </button>
                        </div>
                        <div
                            style={{
                                width: "100%",
                                paddingTop: "5px",
                            }}
                        >
                            <button
                                className="destructiveFriendBtn friendBtn"
                                style={{
                                    width: "100%",
                                    backgroundColor: "black",
                                }}
                                onClick={() => toast.dismiss()}
                            >
                                Ignore
                            </button>
                        </div>
                    </div>,
                    {
                        duration: 15000,
                    }
                );
            });
        }
    }, [userDoc]);

    const fetchActivities = async () => {
        if (currentIdDocument[0]) {
            setActivities(currentIdDocument[0].activities);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [currentIdDocument]);

    const yourProfile = userDoc && id == userDoc.username;
    const areFriends = () => {
        return currentIdDocument && currentIdDocument[0].friends.includes(projectAuth.currentUser.uid);
    };

    const requstSentByCurrentUser = () => {
        return currentIdDocument && currentIdDocument[0].friendRequestsReceived.includes(projectAuth.currentUser.uid);
    };

    const requestReceivedByCurrentUser = () => {
        return currentIdDocument && currentIdDocument[0].friendRequestsSent.includes(projectAuth.currentUser.uid);
    };

    const requestReceivedByCurrentUserOnTheirPageFromCertainId = (id) => {
        return userDoc.friendRequestsReceived.includes(id);
    };

    const anyRequestReceivedByCurrentUserOnTheirPage = () => {
        return userDoc.friendRequestsReceived.length > 0;
    };

    const sendFriendRequest = async () => {
        if (!areFriends() && !requstSentByCurrentUser() && !requestReceivedByCurrentUser()) {
            await projectFirestore
                .collection("users")
                .doc(projectAuth.currentUser.uid)
                .update({
                    friendRequestsSent: firebase.firestore.FieldValue.arrayUnion(id),
                });
            await projectFirestore
                .collection("users")
                .doc(id)
                .update({
                    friendRequestsReceived: firebase.firestore.FieldValue.arrayUnion(projectAuth.currentUser.uid),
                });
        }
    };

    const removeFriend = async () => {
        if (areFriends() && !requstSentByCurrentUser() && !requestReceivedByCurrentUser()) {
            await projectFirestore
                .collection("users")
                .doc(projectAuth.currentUser.uid)
                .update({
                    friends: firebase.firestore.FieldValue.arrayRemove(id),
                });
            await projectFirestore
                .collection("users")
                .doc(id)
                .update({
                    friends: firebase.firestore.FieldValue.arrayRemove(projectAuth.currentUser.uid),
                });
        }
    };

    const unsendFriendRequest = async () => {
        if (!areFriends() && requstSentByCurrentUser() && !requestReceivedByCurrentUser()) {
            await projectFirestore
                .collection("users")
                .doc(projectAuth.currentUser.uid)
                .update({
                    friendRequestsSent: firebase.firestore.FieldValue.arrayRemove(id),
                });
            await projectFirestore
                .collection("users")
                .doc(id)
                .update({
                    friendRequestsReceived: firebase.firestore.FieldValue.arrayRemove(projectAuth.currentUser.uid),
                });
        }
    };

    const acceptFriendRequest = async (id) => {
        if (!areFriends() && requestReceivedByCurrentUserOnTheirPageFromCertainId(id) && !requstSentByCurrentUser()) {
            await projectFirestore
                .collection("users")
                .doc(projectAuth.currentUser.uid)
                .update({
                    friendRequestsReceived: firebase.firestore.FieldValue.arrayRemove(id),
                    friends: firebase.firestore.FieldValue.arrayUnion(id),
                });
            await projectFirestore
                .collection("users")
                .doc(id)
                .update({
                    friendRequestsSent: firebase.firestore.FieldValue.arrayRemove(projectAuth.currentUser.uid),
                    friends: firebase.firestore.FieldValue.arrayUnion(projectAuth.currentUser.uid),
                });
        }
    };

    const rejectFriendRequest = async (id) => {
        if (!areFriends() && requestReceivedByCurrentUserOnTheirPageFromCertainId(id) && !requstSentByCurrentUser()) {
            await projectFirestore
                .collection("users")
                .doc(projectAuth.currentUser.uid)
                .update({
                    friendRequestsReceived: firebase.firestore.FieldValue.arrayRemove(id),
                });
            await projectFirestore
                .collection("users")
                .doc(id)
                .update({
                    friendRequestsSent: firebase.firestore.FieldValue.arrayRemove(projectAuth.currentUser.uid),
                });
        }
    };

    const handleEdit = () => {
        navigate("/profile/edit");
    };

    if (error) {
        return (
            <>
                <Navbar />
                <div className="errorDiv">Sorry, we couldn&apos;t fetch that user</div>
            </>
        );
    }

    if (currentIdDocument && (currentIdDocument[0] == null || currentIdDocument[0] == undefined)) {
        return (
            <>
                <Navbar />
                <div className="errorDiv">Sorry, we couldn&apos;t fetch that user</div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            {currentIdDocument && (
                <div className="profile">
                    <div className="basicInfo">
                        <div className="titleAndEdit">
                            <h2 className="name">{currentIdDocument[0].displayName}</h2>
                            {yourProfile ? (
                                <div className="editButtonDiv" onClick={handleEdit}>
                                    <IconPencil className="editIcon" />
                                </div>
                            ) : null}
                        </div>
                        <div className="friendAndPfpDiv">
                            {yourProfile ? null : (
                                <>
                                    {areFriends() ? (
                                        <button className="friendBtn destructiveFriendBtn" onClick={removeFriend}>
                                            Remove Friend
                                        </button>
                                    ) : null}
                                    {requstSentByCurrentUser() ? (
                                        <button className="friendBtn destructiveFriendBtn" onClick={unsendFriendRequest}>
                                            Unsend Friend Request
                                        </button>
                                    ) : null}
                                    {!areFriends() && !requestReceivedByCurrentUser() && !requstSentByCurrentUser() ? (
                                        <button className="friendBtn constructiveFriendBtn" onClick={sendFriendRequest}>
                                            Send Friend Request
                                        </button>
                                    ) : null}
                                </>
                            )}
                            <img
                                className="profilePfp"
                                src={getDefaultPfp(currentIdDocument[0].displayName)}
                                alt="Profile Picture"
                                height={80}
                                width={80}
                            />
                        </div>
                    </div>
                    <div className="bio">
                        <h3 className="profileSubTitles">Bio</h3>
                        <p className="bioText">{currentIdDocument[0].bio ? currentIdDocument[0].bio : "..."}</p>
                    </div>
                    <div className="dividerDiv">
                        <Divider />
                    </div>
                    <div className="yourActivities">
                        <h3 className="profileSubTitles" id="yourActivitiesTitle">
                            {yourProfile ? "Your" : "Their"} Activities
                        </h3>
                        <div className="activityOrPostOrFriendContainerDivProfile">
                            {activities && activities.length != 0 ? (
                                activities.map((id) => {
                                    return (
                                        <Link to={`/activity/${id}`} key={id} className="activityLink">
                                            <p className="randomTxt">
                                                {activityList.filter((activity) => activity.id.toString() == id)[0].title}
                                            </p>
                                        </Link>
                                    );
                                })
                            ) : (
                                <p className="randomTxt">It&apos;s real quiet in here...</p>
                            )}
                        </div>
                    </div>
                    {yourProfile && userDoc.friends ? (
                        <>
                            <div className="dividerDiv">
                                <Divider />
                            </div>
                            <div className="yourFriends">
                                <h3 className="profileSubTitles" id="yourFriendsTitle">
                                    Your Friends
                                </h3>
                                <div className="activityOrPostOrFriendContainerDivProfile">
                                    {userDoc.friends.map((friendId) => {
                                        return (
                                            <Link to={`/profile/${friendId}`} className="friendsLink" key={friendId}>
                                                <p className="randomTxt">{friendId}</p>
                                            </Link>
                                        );
                                    })}
                                    {userDoc.friends.length == 0 ? <p className="randomTxt">:(</p> : null}
                                </div>
                            </div>
                        </>
                    ) : null}
                    {yourProfile ? (
                        <div className="logoutDiv">
                            <button onClick={logout} className="logoutBtn">
                                Logout
                            </button>
                        </div>
                    ) : null}
                    {yourProfile && (
                        <>
                            {anyRequestReceivedByCurrentUserOnTheirPage() ? (
                                <div className="friendButtonDiv">
                                    {userDoc &&
                                        userDoc.friendRequestsReceived &&
                                        userDoc.friendRequestsReceived.map((friendReq) => {
                                            return (
                                                <>
                                                    <Toaster
                                                        key={friendReq}
                                                        toastOptions={{
                                                            style: {
                                                                backgroundColor: "#1e1e1e",
                                                                border: "none",
                                                            },
                                                        }}
                                                    />
                                                </>
                                            );
                                        })}
                                </div>
                            ) : null}
                        </>
                    )}
                </div>
            )}
        </>
    );
}
