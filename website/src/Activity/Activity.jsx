import "./Activity.css";
import { useParams } from "react-router-dom";
import { useDocument } from "../hooks/useDocument";

export default function Activity() {
    const { id } = useParams();
    const { document, error } = useDocument("activities", id);
    if (error) {
        console.log("ERROR FETCHING DOCUMENT");
    }
    console.log(document);
    return (
        <div>
            Not sure what goes here for now, so just keeping this:
            {document && (
                <div className="fullActivity">
                    <h2>Posted by User: {document.username}</h2>
                    <h1>Title: {document.title}</h1>
                    <h3>Text: {document.text}</h3>
                </div>
            )}
        </div>
    );
}
