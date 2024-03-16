import { TextInput, Textarea } from "@mantine/core";
import firebase from "firebase/app";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { projectFirestore } from "../firebase/config";
import { useAuthContext } from "../hooks/useAuthContext";
import { useUserDocContext } from "../hooks/useUserDocContext";
import "./Create.css";

const Create = () => {
    const { user } = useAuthContext();
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [type, setType] = useState("");
    const [location, setLocation] = useState("");
    const [disabled, setDisabled] = useState(true);
    const navigateTo = useNavigate();

    const { userDoc: document, error } = useUserDocContext();
    if (error) {
        console.log(error);
    }

    useEffect(() => {
        if (title != "" && text != "" && type != "" && location != "") {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [title, text, type, location]);

    const handleCreatePost = async () => {
        try {
            const currentDate = firebase.firestore.FieldValue.serverTimestamp();
            const userId = user.uid;
            const postsCollection = projectFirestore.collection("posts");

            const likes = 0;

            const docRef = await postsCollection.add({
                title,
                text,
                type,
                likes,
                location,
                creatorName: user.displayName,
                creator: userId,
                createdAt: currentDate,
                updatedAt: currentDate,
            });

            if (document && document.posts) {
                await projectFirestore
                    .collection("users")
                    .doc(user.uid)
                    .update({
                        posts: [...document.posts, projectFirestore.collection("posts").doc(docRef.id)],
                    });
            } else {
                await projectFirestore
                    .collection("users")
                    .doc(user.uid)
                    .update({
                        posts: [projectFirestore.collection("posts").doc(docRef.id)],
                    });
            }

            setTitle("");
            setText("");
            setType("");
            navigateTo(`/forum/${docRef.id}`);
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="createPostContainer">
                <h2>Create Post</h2>
                <div className="createPostFormDiv">
                    <TextInput
                        label="Title"
                        placeholder="What's happening?"
                        size="lg"
                        onChange={(e) => setTitle(e.target.value)}
                        className="createPostInput"
                    />

                    <Textarea
                        label="Text"
                        placeholder="I need some help with..."
                        size="lg"
                        autosize
                        onChange={(e) => setText(e.target.value)}
                        className="createPostInput"
                    />

                    <TextInput
                        label="What type of activity is this?"
                        placeholder="Debate"
                        size="lg"
                        className="createPostInput"
                        onChange={(e) => setType(e.target.value)}
                    />

                    <TextInput
                        label="Where is it happening?"
                        placeholder="Online / Boston, MA"
                        size="lg"
                        className="createPostInput"
                        onChange={(e) => setLocation(e.target.value)}
                    />

                    <button
                        disabled={disabled}
                        style={{
                            cursor: disabled ? "not-allowed" : "pointer",
                            backgroundColor: disabled ? "#1a1a1a" : "#ff6d00",
                        }}
                        type="button"
                        onClick={handleCreatePost}
                    >
                        Create Post
                    </button>
                </div>
            </div>
        </>
    );
};

export default Create;
