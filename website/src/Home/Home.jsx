import { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import "./Home.css";
import { useCollection } from "../hooks/useCollection";
import sortDocuments from "../functions/sortDocuments";
import HomeSection from "../HomeSection/HomeSection";
import getUniqueTypes from "../functions/getUniqueTypes";
import nexusLogo from "../assets/NEXUS_LOGO-nobackground.png";
import { Loader } from "@mantine/core";
import Card_Home_Main from "../Card_Home_Main/CardGridHomeMain";


export default function Home() {
    const [sorted_documents, setSortedDocuments] = useState(null);

    // when we make the model, change the query to reflect the type the user would actually want to see
    const limit = 30; // the limit of how many documents to get (we don't wanna get hundreds extra when we don't need it)
    const { documents, error } = useCollection("activities", null, null, limit, "ActivityDocuments");
    const mainCarouselRef = useRef(null);

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
    let scrollAmount = 0;

    const handlePreviousClick = () => {
        scrollAmount = Math.max(scrollAmount - window.innerWidth, 0);
        if (mainCarouselRef.current) {
            mainCarouselRef.current.scrollTo({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };
    
    const handleNextClick = () => {
        const maxScroll = mainCarouselRef.current.scrollWidth - mainCarouselRef.current.clientWidth;
        scrollAmount = Math.min(scrollAmount + window.innerWidth, maxScroll);
        if (mainCarouselRef.current) {
            mainCarouselRef.current.scrollTo({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };
    


    return (
        <>
            <Navbar />
            {documents ? (
                <div className="homeDiv">
                    <div className="title_carousel_container">
                        {/* <img src={nexusLogo} alt="Nexus Logo" id="Home_Logo_Img" />
                        <h1 id="title">Nexus</h1> */}
                        <button className="home_previous_button" onClick={handlePreviousClick}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-caret-left"
                                viewBox="0 0 16 16"
                            >
                                <path d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z" />
                            </svg>
                        </button>
                        <button className="home_next_button" onClick={handleNextClick}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-caret-right"
                                viewBox="0 0 16 16"
                            >
                                <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
                            </svg>
                        </button>
                        <div className="home_main_carousel" ref = {mainCarouselRef}>
                                <Card_Home_Main
                                    className="card_home_main"
                                    key= "1"
                                    title= "1"
                                    text= "1"
                                    author= "1"
                                    id= "1"
                                    activity= "True"
                                />
                                <Card_Home_Main
                                    className="card_home_main"
                                    key= "2"
                                    title= "2"
                                    text= "2"
                                    author= "2"
                                    id= "2"
                                    activity= "True"
                                />                                
                                <Card_Home_Main
                                    className="card_home_main"
                                    key= "3"
                                    title= "3"
                                    text= "3"
                                    author= "3"
                                    id= "3"
                                    activity= "True"
                                />
                        </div>
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
