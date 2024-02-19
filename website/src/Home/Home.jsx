import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import "./Home.css";
import { useCollection } from "../hooks/useCollection";
import sortDocuments from "../functions/sortDocuments";
import HomeSection from "../HomeSection/HomeSection";
import getUniqueTypes from "../functions/getUniqueTypes";
import nexusLogo from "../assets/NEXUS_LOGO-nobackground.png";
import { Loader } from "@mantine/core";

export default function Home() {
    const [sorted_documents, setSortedDocuments] = useState(null);

    // when we make the model, change the query to reflect the type the user would actually want to see
    const limit = 30; // the limit of how many documents to get (we don't wanna get hundreds extra when we don't need it)
    const { documents, error } = useCollection("activities", null, null, limit);

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
        console.log(uniqueTypeArr);
    }

    return (
        <>
            <Navbar />
            {documents ? (
                <div className="homeDiv">
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
            ) : (
                <div className="loadingDiv">
                    <Loader className="loading" color="#ff6d00" size="xl" />
                </div>
            )}
        </>
    );
}
