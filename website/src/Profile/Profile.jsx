import firebase from "firebase/app";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProjectFilter from "../Filter/ProjectFilter";
import Navbar from "../Navbar/Navbar";
import { projectAuth, projectFirestore } from "../firebase/config";
import { useDocument } from "../hooks/useDocument";
import { useUserDocContext } from "../hooks/useUserDocContext";
import "./Profile.css";
import { Divider } from "@mantine/core";
import { IconFriends, IconPencil, IconX } from "@tabler/icons-react";
import { Toaster, toast } from "sonner";

export default function Profile() {
    const { id } = useParams();
    const { document: currentIdDocument, error } = useDocument("users", id);
    const { userDoc } = useUserDocContext();
    const [activities, setActivities] = useState(null);
    const [posts, setPosts] = useState(null);
    const [postsAdded, setPostsAdded] = useState(null);
    const navigate = useNavigate();

    const [filter, setFilter] = useState("All");

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

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
        if (currentIdDocument && currentIdDocument.activities) {
            // Extract activity references

            const activityDocsPromises = currentIdDocument.activities.map(async (activity) => {
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
            // console.log(activityDocs);
            setActivities(activityDocs);
        }
    };

    const fetchPostsAdded = async () => {
        if (currentIdDocument && currentIdDocument.activities && currentIdDocument.postsAdded) {
            // Extract activity references

            const postAddedDocsPromises = currentIdDocument.postsAdded.map(async (post) => {
                const postRef = post.postDoc;
                const postDocSnapshot = await postRef.get();
                const postDocData = postDocSnapshot.data();
                return {
                    ...postDocData,
                    completed: post.completed,
                    startDate: post.startDate,
                    rating: post.rating,
                    comment: post.comment,
                    endDate: post.endDate,
                };
            });

            const postAddedDocs = await Promise.all(postAddedDocsPromises);
            // console.log(activityDocs);
            setPostsAdded(postAddedDocs);
        }
    };

    const fetchPosts = async () => {
        if (currentIdDocument && currentIdDocument.posts) {
            const postDocsPromises = currentIdDocument.posts.map(async (post) => {
                const postDocSnapShot = await post.get();
                const postId = post.id;
                const postDocData = postDocSnapShot.data();
                return { ...postDocData, postId };
            });

            const postDocs = await Promise.all(postDocsPromises);
            // console.log(postDocs);
            setPosts(postDocs);
        }
    };

    useEffect(() => {
        fetchActivities();
        fetchPosts();
        fetchPostsAdded();
    }, [currentIdDocument]);

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
        ? filteredActivities.filter((document) => document.title.includes(searchQuery))
        : null;

    const lastRowIndex = currentPage * rowsPerPage;
    const firstRowIndex = lastRowIndex - rowsPerPage;
    const currentActivities = searchedActivities ? searchedActivities.slice(firstRowIndex, lastRowIndex) : null;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil((searchedActivities?.length || 0) / rowsPerPage);

    const yourProfile = id == projectAuth.currentUser.uid;

    const areFriends = () => {
        return currentIdDocument.friends.includes(projectAuth.currentUser.uid);
    };

    const requstSentByCurrentUser = () => {
        return currentIdDocument.friendRequestsReceived.includes(projectAuth.currentUser.uid);
    };

    const requestReceivedByCurrentUser = () => {
        return currentIdDocument.friendRequestsSent.includes(projectAuth.currentUser.uid);
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
        return <div className="errorDiv">Sorry, we couldn&apos;t fetch that user</div>;
    }

    return (
        <>
            <Navbar />
            {currentIdDocument && (
                <div className="profile">
                    <div className="basicInfo">
                        <div className="titleAndEdit">
                            <h2 className="name">{currentIdDocument.displayName}</h2>
                            {yourProfile ? (
                                <div className="editButtonDiv" onClick={handleEdit}>
                                    <IconPencil className="editIcon" />
                                </div>
                            ) : null}
                        </div>
                        {yourProfile ? (
                            <Link className="settingsLink" to={"/profile/settings"}>
                                Settings
                            </Link>
                        ) : (
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
                    </div>
                    <div className="bio">
                        <h3 className="profileSubTitles">Bio</h3>
                        <p className="bioText">
                            {currentIdDocument.bio
                                ? currentIdDocument.bio
                                : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore itaque suscipit eveniet adipisciearum soluta accusantium quisquam, ad excepturi nam reiciendis tenetur veritatis, et voluptatibus accusamus, quia maiores. Dolorum, omnis. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum facilis aut saepe veritatis, voluptate, sed pariatur illo dignissimos magnam iste doloribus maxime nulla adipisci odio. Vitae culpa debitis modi facere."}
                        </p>
                    </div>
                    <div className="dividerDiv">
                        <Divider />
                    </div>
                    <div className="yourActivities">
                        <h3 className="profileSubTitles" id="yourActivitiesTitle">
                            {yourProfile ? "Your" : "Their"} Activities
                        </h3>
                        {currentActivities ? (
                            currentActivities.map((document) => {
                                return (
                                    // currently the link wont lead anywhere
                                    // cuz we haven't set any uid lol
                                    <Link to={`/activity/${document.uid}`} key={document.uid} className="activityLink">
                                        <p>{document.title}</p>
                                    </Link>
                                );
                            })
                        ) : (
                            <p>It&apos;s real quiet in here...</p>
                        )}
                    </div>
                    <div className="dividerDiv">
                        <Divider />
                    </div>
                    <div className="yourPosts">
                        <h3 className="profileSubTitles" id="yourPostsTitle">
                            {yourProfile ? "Your" : "Their"} Posts
                        </h3>
                        {posts &&
                            posts.map((document) => {
                                return (
                                    <Link to={`/forum/${document.postId}`} key={document.postId} className="postLink">
                                        <p>{document.title}</p>
                                    </Link>
                                );
                            })}
                        {!posts && yourProfile && (
                            <Link to={"/create"} className="postLink">
                                <p>Create your first post!</p>
                            </Link>
                        )}
                        {!posts && !yourProfile && <p>Crickets...</p>}
                    </div>
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
