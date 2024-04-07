import { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import "./Home.css";
import HomeSection from "../HomeSection/HomeSection";
import getUniqueTypes from "../functions/getUniqueTypes";
import { Loader } from "@mantine/core";
import Card_Home_Main from "../Card_Home_Main/CardGridHomeMain";
import activityList from "../List/activities";
import Fuse from "fuse.js";


export default function Home() {
    const [mode, setMode] = useState([]);
    const [ageList, setAgeList] = useState([]);
    const [cost, setCost] = useState([]);
    const [date, setDate] = useState([]);
    const [tags, setTags] = useState([]);
    const [errorAge, setErrorAge] = useState(null);
    const [locationValue, setLocationValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [documents, setDocuments] = useState([...activityList]);

    const handleFilter = () => {
        const filteredDocs = [];
        activityList.forEach((activityDoc) => {
            let passedAllChecks = true;
            if (ageList.length != 0 && passedAllChecks == true) {
                for (let index = 0; index < ageList.length; index++) {
                    const age = ageList[index];
                    if (!activityDoc.age.includes(age.toString())) {
                        passedAllChecks = false;
                    } else {
                        passedAllChecks = true;
                        break;
                    }
                }
            }

            if (mode.length != 0 && passedAllChecks == true) {
                for (let index = 0; index < mode.length; index++) {
                    const modeSelection = mode[index];
                    const modeMapping = {
                        Hybrid: "hybrid",
                        "Remote / Online": "remote",
                        "In Person": "inPerson",
                    };
                    if (!activityDoc.mode.includes(modeMapping[modeSelection])) {
                        passedAllChecks = false;
                    } else {
                        passedAllChecks = true;
                        break;
                    }
                }
            }

            if (tags.length != 0 && passedAllChecks == true) {
                for (let index = 0; index < tags.length; index++) {
                    const tagSelection = tags[index];
                    console.log(tagSelection);
                    if (activityDoc.tags.includes(tagSelection)) {
                        passedAllChecks = true;
                        break;
                    } else {
                        passedAllChecks = false;
                    }
                }
            }

            if (cost.length != 0 && passedAllChecks == true) {
                if (
                    cost.length == 1 &&
                    ((cost[0] == "Free" && activityDoc.paid[0] == true) ||
                        (cost[0] == "Has fee" && activityDoc.paid[0] == false))
                ) {
                    passedAllChecks = false;
                } else if (cost.length == 2) {
                    passedAllChecks = true;
                } else {
                    passedAllChecks = true;
                }
            }

            if (locationValue != "" && passedAllChecks == true) {
                if (activityDoc.location.includes(locationValue)) {
                    passedAllChecks = true;
                } else {
                    passedAllChecks = false;
                }
            }

            if (date.length != 0 && passedAllChecks == true) {
                const userDate = new Date(date[1]);
                const docDate = new Date(activityDoc.deadline.replace(/(\d+)(st|nd|rd|th)/, "$1"));
                console.log(userDate);
                console.log(docDate);
                if (userDate < docDate) {
                    passedAllChecks = true;
                    console.log("works");
                } else {
                    passedAllChecks = false;
                }
            }

            if (passedAllChecks) {
                filteredDocs.push(activityDoc);
            }
        });
        setDocuments(filteredDocs);
    };

    const handleSearch = () => {
        const fuseOptions = {
            isCaseSensitive: false,
            // includeScore: false,
            shouldSort: true,
            // includeMatches: false,
            // findAllMatches: false,
            // minMatchCharLength: 1,
            // location: 0,
            threshold: 0.3,
            // distance: 100,
            // useExtendedSearch: false,
            ignoreLocation: true,
            // ignoreFieldNorm: false,
            // fieldNormWeight: 1,
            keys: ["title", "text", "host"],
        };
        const fuse = new Fuse(activityList, fuseOptions);

        console.log(fuse.search(searchValue));
    };

    let uniqueTypeArr = null;
    if (documents) {
        uniqueTypeArr = getUniqueTypes(documents);
    }

    let scrollAmount = 0;

    const mainCarouselRef = useRef(null);


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
                    {uniqueTypeArr != null
                        ? uniqueTypeArr.map((uniqueTypeObj) => {
                              return (
                                  <HomeSection
                                      key={uniqueTypeObj + Math.random()}
                                      uniqueTypeObj={uniqueTypeObj}
                                      sorted_documents={documents}
                                  />
                              );
                          })
                        : null}
                </div>
            ) : (
                <div className="loadingDiv">
                    <Loader className="loading" color="#ff6d00" size="xl" />
                </div>
            )}
        </>
    );
}