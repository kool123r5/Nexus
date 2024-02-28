import Navbar from "../Navbar/Navbar";
import "./Forum.css";
import { useCollection } from "../hooks/useCollection";
import sortPosts from "../functions/sortPosts";
import { Loader } from "@mantine/core";
import Card from "../Card/CardGrid";

export default function Forum() {
    const { documents, error } = useCollection("posts", null, null, 5, "ForumDocuments");
    if (error) console.log(error);

    const sortedDocuments = sortPosts(documents);
    console.log(sortedDocuments);

    return (
        <>
            <Navbar />
            {documents ? (
                <div className="forumDiv">
                    <div className="forYouDiv">
                        <h3>For You</h3>
                        <div className="forYouCards">
                            {sortedDocuments &&
                                sortedDocuments.map((doc) => {
                                    return (
                                        <Card
                                            key={doc.id}
                                            title={doc.title}
                                            text={doc.text}
                                            author={doc.creatorName}
                                            id={doc.id}
                                            activity={false}
                                        />
                                    );
                                })}
                        </div>
                    </div>
                    <div className="miscDiv">
                        <h3>Miscellaneous</h3>
                        <div className="miscCards">
                            {sortedDocuments &&
                                sortedDocuments.map((doc) => {
                                    return (
                                        <Card
                                            key={doc.id}
                                            title={doc.title}
                                            text={doc.text}
                                            author={doc.creatorName}
                                            id={doc.id}
                                        />
                                    );
                                })}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="loadingDiv">
                    <Loader className="loading" color="#ff6d00" size="xl" />
                </div>
            )}
        </>
    );
}
