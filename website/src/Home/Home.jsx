import { Loader } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import Card_Home_Main from "../Card_Home_Main/CardGridHomeMain";
import HomeSection from "../HomeSection/HomeSection";
import Navbar from "../Navbar/Navbar";
import getUniqueTypes from "../functions/getUniqueTypes";
import sortDocuments from "../functions/sortDocuments";
import { useCollection } from "../hooks/useCollection";
import "./Home.css";

export default function Home() {
    const [sorted_documents, setSortedDocuments] = useState(null);

    // when we make the model, change the query to reflect the type the user would actually want to see
    const limit = 30; // the limit of how many documents to get (we don't wanna get hundreds extra when we don't need it)
    const { documents, error } = useCollection("activities", null, null, limit, "ActivityDocuments");
    const mainCarouselRef = useRef(null);
    const { documents: topActivityDocuments, error: topActivityError } = useCollection(
        "activities",
        null,
        ["title", "desc"], // sorts descendingly by title, add better heuristic later
        3,
        "TopActivityDocuments"
    );

    if (error || topActivityError) {
        console.log(error, topActivityError);
    }

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
                        <div className="home_main_carousel" ref={mainCarouselRef}>
                            {topActivityDocuments &&
                                topActivityDocuments.map((topActivityDoc, index) => {
                                    return (
                                        <Card_Home_Main
                                            key={index}
                                            className="card_home_main"
                                            title={topActivityDoc.title}
                                            text={topActivityDoc.text}
                                            author={topActivityDoc.host}
                                            activity={true}
                                            id={topActivityDoc.id}
                                        />
                                    );
                                })}
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
