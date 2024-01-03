import Navbar from "../Navbar/Navbar";
import "./Forum.css";
import { useCollection } from "../hooks/useCollection";
import sortPosts from "../functions/sortPosts";

export default function Forum() {
    const { documents, error } = useCollection("posts");
    if (error) console.log(error);

    const sortedDocuments = sortPosts(documents);
    console.log(sortedDocuments);
    return (
        <>
            <Navbar />
            <div>
                <>
                    {sortedDocuments &&
                        sortedDocuments.map((doc) => {
                            // not sure what to keep here, so keeping this for now
                            return (
                                <p key={Math.random()}>
                                    Created by: {doc.creator}
                                    <br /> Points: {doc.points}
                                    <br /> Text: {doc.text}
                                    <br /> Title: {doc.title}
                                </p>
                            );
                        })}
                </>
            </div>
        </>
    );
}
