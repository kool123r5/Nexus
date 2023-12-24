import Card from "../Card/CardGrid";
import Navbar from "../Navbar/Navbar";
import "./Home.css";
import { useCollection } from "../hooks/useCollection";

export default function Home() {
    let collection = useCollection("activities");
    let title = [];
    let text = [];
    let type = [];
    if (collection.error != null) {
        console.log("ERROR FETCHING DOCUMENTS");
    }
    let array_of_documents = collection.documents;
    if (array_of_documents != null) {
        array_of_documents.forEach((document) => {
            title.push(document.title);
            text.push(document.text);
            type.push(document.type);
        });
    }
    return (
        <>
            <Navbar />
            <div>Home</div>
        </>
    );
}
