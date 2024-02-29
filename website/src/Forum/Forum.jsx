import Navbar from "../Navbar/Navbar";
import "./Forum.css";
import { useCollection } from "../hooks/useCollection";
import sortPosts from "../functions/sortPosts";
import { Loader } from "@mantine/core";
import Card_Forum from "../Card_Forum/CardGridForum";
import React, { useRef } from "react";


export default function Forum() {
    const { documents, error } = useCollection("posts", null, null, 5);
    if (error) console.log(error);

    const sortedDocuments = sortPosts(documents);
    console.log(sortedDocuments);


    const forYouCarouselRef = useRef(null);
    // const miscCarouselRef = useRef(null);

    // let scrollAmount = 0;


    // const handlePreviousClick = (carouselRef) => {
    //     scrollAmount = Math.max(scrollAmount - window.innerWidth, 0);
    //     if (carouselRef.current) {
    //         carouselRef.current.scrollTo({
    //             left: scrollAmount,
    //             behavior: "smooth",
    //         });
    //     }
    // };

    // const handleNextClick = (carouselRef) => {
    //     const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
    //     scrollAmount = Math.min(scrollAmount + window.innerWidth, maxScroll);
    //     if (carouselRef.current) {
    //         carouselRef.current.scrollTo({
    //             left: scrollAmount,
    //             behavior: "smooth",
    //         });
    //     }
    // };

    return (
        <>
            <Navbar />
            {documents ? (
                <div className="forumDiv">
                    <div className="forumSideBar">
                        <button className="forumSideBarButton" id = "miscForumButton">Misc</button>
                        <button className="forumSideBarButton">Physics</button>
                        <button className="forumSideBarButton">Chemistry</button>
                        <button className="forumSideBarButton">Economics</button>
                        <button className="forumSideBarButton">+ Add Folder</button>
                        <button className="forumSideBarButton" id = "savedForumButton">Saved</button>
                    </div>
                    <div className="forYouDiv">
                        <div className="carouselHeaderContainers">
                            <h2 className="forumCarouselHeader">search bar (i cant implement that)</h2>
                            <button className="forumFilterButton">Filter</button>
                        </div>
                        <div className="forYouCarouselContainer">
                            {/* <button className="previous_button" onClick={() => handlePreviousClick(forYouCarouselRef)}>
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
                            
                            <button className="next_button" onClick={() => handleNextClick(forYouCarouselRef)}>
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
                            </button> */}

                            <div className="forYouCards" ref = {forYouCarouselRef}>
                                {sortedDocuments &&
                                    sortedDocuments.map((doc) => {
                                        return (
                                            <Card_Forum
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
                    </div>

                    
                        {/* <div className="miscDiv">
                            <div className="carouselHeaderContainers">
                                <h2 className="forumCarouselHeader">Miscelleneous</h2>
                            </div>

                            <div className="miscCarouselContainer">
                                <button className="previous_button" onClick={() => handlePreviousClick(miscCarouselRef)}>
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
                                
                                <button className="next_button" onClick={() => handleNextClick(miscCarouselRef)}>
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


                                <div className="miscCards" ref = {miscCarouselRef}>
                                
                                    {sortedDocuments &&
                                        sortedDocuments.map((doc) => {
                                            return (
                                                <Card
                                                    key={doc.id}
                                                    title={doc.title}
                                                    text={doc.text}
                                                    author={doc.creatorName}
                                                    id={doc.id}
                                                    activity = {false}
                                                />
                                            );
                                        })}
                                </div>


                            </div>
                        </div> */}


                </div>
                
            ) : (
                <div className="loadingDiv">
                    <Loader className="loading" color="#ff6d00" size="xl" />
                </div>
            )}
        </>
    );
}
