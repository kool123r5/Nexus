import Navbar from "../Navbar/Navbar";
import "./Forum.css";
import { useCollection } from "../hooks/useCollection";
import sortPosts from "../functions/sortPosts";
import { Link } from "react-router-dom";
import { Loader } from "@mantine/core";

export default function Forum() {
    const { documents, error } = useCollection("posts");
    if (error) console.log(error);

    const sortedDocuments = sortPosts(documents);
    console.log(sortedDocuments);
    return (
        <>
            <Navbar />
            {documents ? (
                <div className="forum">
                    <>
                        {sortedDocuments &&
                            sortedDocuments.map((doc) => {
                                // not sure what to keep here, so keeping this for now
                                return (
                                    <p key={Math.random()}>
                                        Created by: {doc.creatorName}
                                        <br /> Points: {doc.likes}
                                        <br /> Text: {doc.text}
                                        <br /> <Link to={`/forum/${doc.id}`}> Title: {doc.title} </Link>
                                    </p>
                                );
                            })}
                    </>
                </div>
            ) : (
                <div className="loadingDiv">
                    <Loader className="loading" color="#ff6d00" size="xl" />
                </div>
            )}
        </>
    );
}
