import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectFirestore } from "../firebase/config";
import { useDocument } from "../hooks/useDocument";
import Navbar from "../Navbar/Navbar";
import { useAuthContext } from "../hooks/useAuthContext";
import firebase from "firebase/app";

const PostDetail = () => {
    const { id } = useParams();
    const { user, authIsReady } = useAuthContext();
    const [post, setPost] = useState(null);
    const [editable, setEditable] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState("");
    const [updatedText, setUpdatedText] = useState("");
    const [updatedType, setUpdatedType] = useState("");
    const [updatedLocation, setUpdatedLocation] = useState("");
    const [updatedTime, setUpdatedTime] = useState("");
    const { document, isPending, error } = useDocument("posts", id);
    const [fetch, setFetch] = useState(false);
    const navigateTo = useNavigate();

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

    return (
        <div>
            <Navbar></Navbar>
            {document && (
                <>
                    <h2>Post {id}</h2>
                    <p>Title: {document.title}</p>
                    <p>Text: {document.text}</p>
                    <p>Type: {document.type}</p>
                    <p>Location: {document.location}</p>
                    <p>Creator: {document.creatorName}</p>
                    <p>Created At: {document.createdAt && document.createdAt.toDate().toString()}</p>
                    <p>Updated At: {document.updatedAt && document.updatedAt.toDate().toString()}</p>
                </>
            )}

            {editable && (
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
        </div>
    );
};

export default PostDetail;
