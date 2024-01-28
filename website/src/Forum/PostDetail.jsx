import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { projectFirestore, timestamp } from "../firebase/config";
import { useDocument } from "../hooks/useDocument";
import Navbar from "../Navbar/Navbar";
import { useAuthContext } from "../hooks/useAuthContext";
import firebase from "firebase/app";
import { useUserDocContext } from "../hooks/useUserDocContext";

const PostDetail = () => {
    const { id } = useParams();
    const { user, authIsReady } = useAuthContext();
    const [text, setText] = useState("Add Activity");

    const [post, setPost] = useState(null);
    const [editable, setEditable] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState("");
    const [updatedText, setUpdatedText] = useState("");
    const [updatedType, setUpdatedType] = useState("");
    const [updatedLocation, setUpdatedLocation] = useState("");

    const [updatedTime, setUpdatedTime] = useState("");
    const { document, isPending, error } = useDocument("posts", id);
    const [fetch, setFetch] = useState(false);

    const [disabled, setDisabled] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [activityRemoved, setActivityRemoved] = useState(false);
    const [rating, setRating] = useState("");
    const [comment, setComment] = useState("");

    const navigateTo = useNavigate();

    const newPost = {
        postDoc: projectFirestore.doc(`posts/${id}`),
        startDate: timestamp.now(),
        endDate: null,
        comment: null,
        rating: null,
        completed: "Pending",
    };
    // const userDoc = useDocument("users", user.uid);
    const userDoc = useUserDocContext();
    if (userDoc.error) {
        console.log(userDoc.error);
    }

    const handleComplete = (e) => {
        e.preventDefault();
        const postsAdded = userDoc.document.postsAdded;
        const updatedPosts = postsAdded.map((post) => {
            if (
                post["postDoc"]["_delegate"]["_key"]["path"]["segments"].at(-1) ===
                newPost["postDoc"]["_delegate"]["_key"]["path"]["segments"].at(-1)
            ) {
                return {
                    ...post,
                    endDate: timestamp.now(),
                    rating: parseInt(rating),
                    comment: comment,
                    completed: "Completed",
                };
            }
            return post;
        });
        projectFirestore.collection("users").doc(user.uid).update({
            postsAdded: updatedPosts,
        });
        setFormSubmitted(true);
    };

    const handleRemove = async () => {
        const posts = userDoc.document.postsAdded || [];

        try {
            // Remove the activity from the user's document
            const updatedPosts = posts.filter((post) => post.postDoc._delegate._key.path.segments.at(-1) !== id);

            await projectFirestore.collection("users").doc(user.uid).update({
                postsAdded: updatedPosts,
            });

            setActivityRemoved(true);
            setText("Add Activity");
            setDisabled(false);
            setFormSubmitted(false);
            setRating(null);
            setComment(null);
            console.log(disabled);
        } catch (error) {
            console.error("Error removing activity:", error);
            // Handle error if needed
        }
    };

    const handleAdd = () => {
        const posts = userDoc.document.postsAdded || [];

        // Update the activities array in the user's document
        const updatedPosts = [...posts, newPost];

        // Update the user's document with the new activities array
        projectFirestore.collection("users").doc(user.uid).update({
            postsAdded: updatedPosts,
        });

        setText("Successfully added activity");
        setDisabled(true);
        setActivityRemoved(false);
    };

    useEffect(() => {
        if (userDoc.document != null) {
            const postsAdded = userDoc.document.postsAdded || [];
            postsAdded.forEach((post) => {
                console.log(post);
                if (
                    post["postDoc"]["_delegate"]["_key"]["path"]["segments"].at(-1) ==
                        newPost["postDoc"]["_delegate"]["_key"]["path"]["segments"].at(-1) &&
                    post.completed == "Completed"
                ) {
                    setFormSubmitted(true);
                }
            });
        }
    }, [userDoc]);

    useEffect(() => {
        if (userDoc.document != null) {
            const posts = userDoc.document.postsAdded || [];
            posts.forEach((post) => {
                if (
                    post["postDoc"]["_delegate"]["_key"]["path"]["segments"].at(-1) ==
                    newPost["postDoc"]["_delegate"]["_key"]["path"]["segments"].at(-1)
                ) {
                    setDisabled(true);
                    console.log(disabled);
                }
            });
        }
    }, [userDoc]);

    useEffect(() => {
        const fetchUpdatedData = async () => {
            const updatedUserDoc = await projectFirestore.collection("users").doc(user.uid).get();
            const updatedPosts = updatedUserDoc.data().postsAdded || [];

            // Find the updated activity in the array
            const updatedPost = updatedPosts.find((post) => post.postDoc._delegate._key.path.segments.at(-1) === id);

            // Display the updated details
            if (updatedPost) {
                setRating(updatedPost.rating);
                setComment(updatedPost.comment);
            }
        };

        if (formSubmitted) {
            fetchUpdatedData();
        }
    }, [formSubmitted, id, user.uid]);

    useEffect(() => {
        const fetchPost = async () => {
            if (!fetch && document && user && user.uid === document.creator) {
                setEditable(true);
                setUpdatedTitle(document.title);
                setUpdatedText(document.text);
                setUpdatedType(document.type);
                setUpdatedLocation(document.location);
                setUpdatedTime(document.updatedAt);
                setFetch(true);
            }
        };

        fetchPost(), [user, document];
    });

    const handleUpdatePost = async () => {
        try {
            const postRef = projectFirestore.collection("posts").doc(id);
            const updatedAtTime = firebase.firestore.FieldValue.serverTimestamp();
            await postRef.update({
                title: updatedTitle,
                text: updatedText,
                type: updatedType,
                location: updatedLocation,
                updatedAt: updatedAtTime,
            });

            setPost((prevPost) => ({
                ...prevPost,
                title: updatedTitle,
                text: updatedText,
                type: updatedType,
                location: updatedLocation,
                updatedAt: updatedAtTime,
            }));

            setEditable(true);
            setUpdatedTitle("");
            setUpdatedText("");
            setUpdatedType("");
            setUpdatedLocation("");
            setUpdatedTime("");
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    const handleDeletePost = async () => {
        try {
            const postRef = projectFirestore.collection("posts").doc(id);
            await postRef.delete();
            navigateTo("/forum");
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    if (isPending) {
        return <div>Loading...</div>;
    }
    if (!document) {
        return (
            <>
                <Navbar />
                Document not found
            </>
        );
    }
    return (
        <>
            <Navbar />
            {document && (
                <>
                    <h2>Post {document.title}</h2>
                    <p>Title: {document.title}</p>
                    <p>Text: {document.text}</p>
                    <p>Type: {document.type}</p>
                    <p>Location: {document.location}</p>
                    <Link to={`/profile/${document.creator}`}>Creator: {document.creatorName}</Link>
                    <p>Created At: {document.createdAt && document.createdAt.toDate().toString()}</p>
                    <p>Updated At: {document.updatedAt && document.updatedAt.toDate().toString()}</p>
                </>
            )}
            {document && !editable && !disabled && (
                <button id="btn" onClick={handleAdd} disabled={disabled}>
                    Add Activity
                </button>
            )}

            {document && disabled && !formSubmitted && (
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
                            <textarea value={comment} onChange={(e) => setComment(e.target.value)} required />
                        </label>
                        <br />

                        <button type="submit">Complete Activity</button>
                    </form>
                </div>
            )}
            {document && disabled && !activityRemoved && (
                <button id="btn" onClick={handleRemove}>
                    Remove Activity
                </button>
            )}

            {document && formSubmitted && disabled && (
                <div>
                    <h6>Your Ratings and comment:</h6>
                    <p>Rating: {rating}</p>
                    <p>Comment: {comment}</p>
                </div>
            )}
            {document && editable && (
                <div>
                    <h2>Edit Post</h2>
                    <form>
                        <label>Title:</label>
                        <input type="text" value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} />

                        <label>Text:</label>
                        <textarea value={updatedText} onChange={(e) => setUpdatedText(e.target.value)} />

                        <label>Type:</label>
                        <input type="text" value={updatedType} onChange={(e) => setUpdatedType(e.target.value)} />

                        <label>Location:</label>
                        <input type="text" value={updatedLocation} onChange={(e) => setUpdatedLocation(e.target.value)} />

                        <button type="button" onClick={handleUpdatePost}>
                            Update Post
                        </button>
                        <button type="button" onClick={handleDeletePost}>
                            Delete Post
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default PostDetail;
