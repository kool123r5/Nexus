import { Loader, MultiSelect, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useState } from "react";
import Card_Search from "../Card_Search/CardGridSearch";
import Navbar from "../Navbar/Navbar";
import "./Search_Page.css";
import tagArray from "../Signup/tagArray";
import { IconSearch } from "@tabler/icons-react";
import activityList from "../List/activities";
import Fuse from "fuse.js";

export default function Search() {
    const [mode, setMode] = useState([]);
    const [gradeList, setGradeList] = useState([]);
    const [cost, setCost] = useState([]);
    const [date, setDate] = useState([]);
    const [tags, setTags] = useState([]);
    const [errorGrade, setErrorGrade] = useState(null);
    const [locationValue, setLocationValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [documents, setDocuments] = useState([...activityList]);

    const handleFilter = () => {
        const filteredDocs = [];
        activityList.forEach((activityDoc) => {
            let passedAllChecks = true;
            if (gradeList.length != 0 && passedAllChecks == true) {
                for (let index = 0; index < gradeList.length; index++) {
                    const grade = gradeList[index];
                    const gradeMapping = {
                        9: "Freshman",
                        10: "Sophomore",
                        11: "Junior",
                        12: "Senior",
                    };
                    if (activityDoc.gradeRange == "unknown") {
                        passedAllChecks = false;
                        break;
                    }
                    if (!activityDoc.gradeRange.map((val) => val.trim()).includes(gradeMapping[grade.toString()])) {
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
                    ((cost[0] == "Free" && activityDoc.cost[0] == true) ||
                        (cost[0] == "Has fee" && activityDoc.cost[0] == false))
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
                const firstDateEntered = new Date(date[0]);
                const lastDateEntered = new Date(date[1]);
                const regex = /^(\w+)\s(\d+)(th|st|nd|rd)\s(\d{4})$/;
                let match = activityDoc.deadline.match(regex);
                if (match != null) {
                    match.splice(3, 1);
                    match.splice(0, 1);
                    match = match.join(" ");
                }
                const activityDate = new Date(match);

                if (activityDoc.deadline.trim() == "Rolling") {
                    passedAllChecks = true;
                } else if (activityDoc.deadline.includes("Various") || activityDoc.deadline.includes("Contact")) {
                    passedAllChecks = false;
                } else if (activityDate > firstDateEntered && activityDate < lastDateEntered) {
                    passedAllChecks = true;
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

    return (
        <>
            <Navbar />
            {documents ? (
                <div className="searchDiv">
                    <div className="searchSubDiv">
                        <div className="filterDiv">
                            <div className="search_input_div">
                                <TextInput
                                    className="filterInput searchBar"
                                    id="search_search_bar"
                                    placeholder="Search"
                                    leftSection={<IconSearch />}
                                    leftSectionWidth={40}
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                            </div>

                            <div className="row_two_filter">
                                <div className="age_filter_div">
                                    <TextInput
                                        className="filterInput"
                                        placeholder="Grade"
                                        type="text"
                                        min={6}
                                        max={12}
                                        error={errorGrade}
                                        onChange={(e) => {
                                            setErrorGrade(null);
                                            const numberArray = e.target.value.split(",").map(Number);
                                            if (numberArray.includes(NaN)) {
                                                setErrorGrade("Enter valid grades");
                                            } else if (numberArray.includes(0) && numberArray[numberArray.length - 1] != 0) {
                                                setErrorGrade("Enter valid grades");
                                            } else if (numberArray.some((num) => num < 6)) {
                                                setErrorGrade("Grades must be at least 6!");
                                            } else {
                                                if (numberArray[numberArray.length - 1] == 0) {
                                                    setGradeList([...numberArray].slice(0, -1));
                                                } else {
                                                    setGradeList(numberArray);
                                                }
                                            }
                                        }}
                                    />
                                </div>
                                <div className="cost_filter_div">
                                    <MultiSelect
                                        className="filterInput"
                                        placeholder={cost.length == 0 ? "Cost" : undefined}
                                        data={["Free", "Has fee"]}
                                        value={cost}
                                        onChange={(e) => {
                                            setCost(e);
                                        }}
                                        maxLength={1}
                                        searchable
                                        clearable
                                        hidePickedOptions
                                    />
                                </div>
                            </div>

                            <div className="row_three_div">
                                <div className="mode_filter_div">
                                    <MultiSelect
                                        className="filterInput"
                                        placeholder={mode.length == 0 ? "Mode" : undefined}
                                        data={["In Person", "Remote / Online", "Hybrid"]}
                                        value={mode}
                                        onChange={(e) => {
                                            setMode(e);
                                        }}
                                        searchable
                                        clearable
                                        hidePickedOptions
                                    />
                                </div>
                            </div>

                            <div className="row_four_div">
                                <div className="date_filter_div">
                                    <DatePickerInput
                                        clearable
                                        className="filterInput"
                                        type="range"
                                        placeholder="Date Range"
                                        allowSingleDateInRange
                                        value={date}
                                        onChange={(e) => {
                                            setDate(e);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="row_five_div">
                                <div className="location_filter_div">
                                    <TextInput
                                        className="filterInput"
                                        placeholder="Location"
                                        value={locationValue}
                                        onChange={(e) => {
                                            setLocationValue(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="row_six_div">
                                <div className="tags_filter_div">
                                    <MultiSelect
                                        className="filterInput"
                                        placeholder={tags.length == 0 ? "Tags" : undefined}
                                        data={tagArray}
                                        value={tags}
                                        onChange={(e) => {
                                            setTags(e);
                                        }}
                                        searchable
                                        clearable
                                        hidePickedOptions
                                    />
                                </div>
                            </div>

                            <div className="submit_search_div">
                                <button
                                    className="submit_search_individual_button"
                                    onClick={() => {
                                        handleFilter();
                                        handleSearch();
                                    }}
                                >
                                    Search
                                </button>
                                <p className="resultsP">Showing {documents.length} results</p>
                            </div>
                        </div>

                        <div className="resultsDiv">
                            {documents.map((document) => (
                                <Card_Search
                                    key={document.id}
                                    title={document.title}
                                    text={document.text}
                                    author={document.host}
                                    id={document.id.toString()}
                                    activity={true}
                                />
                            ))}
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
