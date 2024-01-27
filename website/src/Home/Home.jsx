import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import "./Home.css";
import { useCollection } from "../hooks/useCollection";
import sortDocuments from "../functions/sortDocuments";
import HomeSection from "../HomeSection/HomeSection";
import getUniqueTypes from "../functions/getUniqueTypes";
import nexusLogo from "../assets/NEXUS_LOGO-nobackground.png";

export default function Home() {
    const [sorted_documents, setSortedDocuments] = useState(null);
    // when we make the model, change the query to reflect the type the user would actually want to see
    const { documents, error } = useCollection("activities");

    useEffect(() => {
        if (error) {
            console.log("ERROR FETCHING DOCUMENTS");
        } else if (documents) {
            const sortedDocs = sortDocuments(documents);
            setSortedDocuments(sortedDocs);
        }
    }, [documents, error]);

    let uniqueTypeArr = null;
    if (sorted_documents) {
        uniqueTypeArr = getUniqueTypes(sorted_documents);
    }

    return (
        <>
            <Navbar />
            <div className="home">
                <div id="title_container">
                    <img src={nexusLogo} alt="Nexus Logo" id="Home_Logo_Img" />
                    <h1 id="title">Nexus</h1>
                </div>
                {uniqueTypeArr &&
                    uniqueTypeArr.map((uniqueTypeObj) => {
                        return (
                            <HomeSection
                                key={uniqueTypeObj + Math.random()}
                                uniqueTypeObj={uniqueTypeObj}
                                sorted_documents={sorted_documents}
                            />
                        );
                    })}
            </div>
        </>
    );
}
