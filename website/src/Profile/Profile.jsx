import Navbar from "../Navbar/Navbar";
import "./Profile.css";
import { useDocument } from "../hooks/useDocument";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import ProjectFilter from "../Filter/ProjectFilter";
import { projectAuth, projectFirestore } from "../firebase/config";
import firebase from "firebase/app";

export default function Profile() {
    const { id } = useParams();
    const { document, error } = useDocument("users", id);
    const [activities, setActivities] = useState(null);
    const [filter, setFilter] = useState("All");
    const [btnText, setBtnText] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const fetchActivities = async () => {
        if (document && document.activities) {
            // Extract activity references

            const activityDocsPromises = document.activities.map(async (activity) => {
                const activityRef = activity.activity;
                const activityDocSnapshot = await activityRef.get();
                const activityDocData = activityDocSnapshot.data();
                return {
                    ...activityDocData,
                    completed: activity.completed,
                    startDate: activity.startDate,
                    rating: activity.rating,
                    comment: activity.comment,
                    endDate: activity.endDate,
                };
            });

            const activityDocs = await Promise.all(activityDocsPromises);
            console.log(activityDocs);
            setActivities(activityDocs);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [document]);

    const changeFilter = (newFilter) => {
        setFilter(newFilter);
    };

    const changeSearchQuery = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredActivities = activities
        ? activities.filter((document) => {
              switch (filter) {
                  case "All":
                      return true;
                  case "Completed":
                  case "Pending":
                      return document.completed === filter;
                  default:
                      return true;
              }
          })
        : null;

    const searchedActivities = filteredActivities
        ? filteredActivities.filter((document) => document.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : null;

    const lastRowIndex = currentPage * rowsPerPage;
    const firstRowIndex = lastRowIndex - rowsPerPage;
    const currentActivities = searchedActivities ? searchedActivities.slice(firstRowIndex, lastRowIndex) : null;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil((searchedActivities?.length || 0) / rowsPerPage);

    const yourProfile = id == projectAuth.currentUser.uid;

    // i think i'm gonna have to change the below functions to use the doc's data itself instead of projectAuth
    // in case the user isn't logged in
    // or active at the time the other user does the stuff

    const sendFriendRequest = async () => {
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
    };

    const removeFriend = async () => {
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
    };

    const unsendFriendRequest = async () => {
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
    };

    const acceptFriendRequest = async () => {};

    const rejectFriendRequest = async () => {};

    return (
        <>
            <Navbar />
            {error && <p>{error}</p>}
            <p>{id}</p>

            {document && (
                <div>
                    Profile
                    <ProjectFilter changeFilter={changeFilter} />
                    <input type="text" value={searchQuery} onChange={changeSearchQuery} placeholder="Search by name" />
                    <p>Welcome: {document.displayName}</p>
                    <br></br>
                    <p>Your activities</p>
                    {currentActivities &&
                        currentActivities.map((document) => {
                            return (
                                <>
                                    <Link to={`/activity/${document.uid}`}>
                                        <p key={Math.random()}>{document.title}</p>{" "}
                                    </Link>
                                </>
                            );
                        })}
                    {!currentActivities && <p>No activities yet</p>}
                    <br />
                    {yourProfile ? (
                        <Link to={"/profile/settings"}>
                            <button>Settings</button>
                        </Link>
                    ) : (
                        <>
                            {document &&
                                console.log(typeof document.authProviders) &&
                                document.friends &&
                                document.friends.includes(projectAuth.currentUser.uid) && (
                                    <button onClick={removeFriend}>Remove Friend</button>
                                )}
                            {document &&
                                document.friends &&
                                document.friendRequestsReceived &&
                                !document.friends.includes(projectAuth.currentUser.uid) &&
                                !document.friendRequestsReceived.includes(projectAuth.currentUser.uid)(
                                    <button onClick={removeFriend}>Add Friend</button>
                                )}
                            {document &&
                                document.friends &&
                                document.friendRequestsReceived &&
                                !document.friends.includes(projectAuth.currentUser.uid) &&
                                document.friendRequestsReceived.includes(projectAuth.currentUser.uid)(
                                    <button onClick={unsendFriendRequest}>Unsend Friend Request</button>
                                )}
                            {document &&
                                document.friends &&
                                document.friendRequestsSent &&
                                !document.friends.includes(projectAuth.currentUser.uid) &&
                                document.friendRequestsSent.includes(projectAuth.currentUser.uid)(
                                    <>
                                        <button onClick={acceptFriendRequest}>Accept Friend Request?</button>
                                        <button onClick={rejectFriendRequest}>Reject Friend Request?</button>
                                    </>
                                )}
                        </>
                    )}
                    {yourProfile &&
                        document.friendRequestsSent &&
                        document.friendRequestsSent.map((friendReq) => {
                            return <p key={Math.random()}>You have sent a friend request to {friendReq}</p>;
                        })}
                    {yourProfile &&
                        document.friendRequestsReceived &&
                        document.friendRequestsReceived.map((friendReq) => {
                            return <p key={Math.random()}>You have received a friend request from {friendReq}</p>;
                        })}
                    {/* 
                    <pagination className="mt-3">
            {Array.from({ length: totalPages }).map((_, index) => (
              <item
                key={index}
                active={currentPage === index + 1}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </item>
            ))}
          </pagination>  */}
                </div>
            )}
        </>
    );
}
