import { Loader, MultiSelect, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import Card_Search from "../Card_Search/CardGridSearch";
import Navbar from "../Navbar/Navbar";
import "./Search_Page.css";
import { IconSearch } from "@tabler/icons-react";
import activityList from "../List/activities";
import Fuse from "fuse.js";
import flattenAndUnique from "../functions/flattenAndUnique";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Search() {
    const navigator = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [mode, setMode] = useState(searchParams.get("mode") != null ? searchParams.get("mode").split("-") : []);
    const [gradeList, setGradeList] = useState(
        searchParams.get("grade") != null ? searchParams.get("grade").split("-") : []
    );
    const [cost, setCost] = useState(searchParams.get("cost") != null ? searchParams.get("cost").split("-") : []);
    const [date, setDate] = useState(searchParams.get("date") != null ? searchParams.get("date") : []);
    const [tags, setTags] = useState(searchParams.get("tags") != null ? searchParams.get("tags").split("-") : []);
    const [locationValue, setLocationValue] = useState(
        searchParams.get("location") != null ? searchParams.get("location").split("-") : []
    );
    const [types, setTypes] = useState(searchParams.get("type") != null ? searchParams.get("type").split("-") : []);
    const [searchValue, setSearchValue] = useState(searchParams.get("search") != null ? searchParams.get("search") : "");
    const [documents, setDocuments] = useState([...activityList]);
    const [currentSlice, setCurrentSlice] = useState(100);

    const tagArray = flattenAndUnique(
        activityList.map((val) => {
            if (val.tags != "unknown") {
                return val.tags;
            } else {
                return [];
            }
        })
    );

    const locationArray = flattenAndUnique(
        activityList.map((val) => {
            if (val.location != "unknown") {
                return [val.location.trim()];
            } else {
                return [];
            }
        })
    );

    const typesArray = flattenAndUnique(
        activityList.map((val) => {
            if (val.type != "unknown" && val.type != undefined && val.type != null) {
                return val.type;
            } else {
                return [];
            }
        })
    );

    const handleFilterAndSearch = () => {
        const filteredDocs = [];

        if (gradeList.length != 0) {
            setSearchParams((params) => {
                params.set("grade", gradeList.join("-"));
            });
        } else {
            setSearchParams((params) => {
                params.delete("grade");
            });
        }

        if (searchValue != null && searchValue != "" && searchValue != undefined) {
            setSearchParams((params) => {
                params.set("search", searchValue);
            });
        } else {
            setSearchParams((params) => {
                params.delete("search");
            });
        }

        if (mode.length != 0) {
            setSearchParams((params) => {
                params.set("mode", mode.join("-"));
            });
        } else {
            setSearchParams((params) => {
                params.delete("mode");
            });
        }

        if (cost.length != 0) {
            setSearchParams((params) => {
                params.set("cost", cost.join("-"));
            });
        } else {
            setSearchParams((params) => {
                params.delete("cost");
            });
        }

        if (tags.length != 0) {
            setSearchParams((params) => {
                params.set("tags", tags.join("-"));
            });
        } else {
            setSearchParams((params) => {
                params.delete("tags");
            });
        }

        if (locationValue.length != 0) {
            setSearchParams((params) => {
                params.set("location", locationValue.join("-"));
            });
        } else {
            setSearchParams((params) => {
                params.delete("location");
            });
        }

        if (types.length != 0) {
            setSearchParams((params) => {
                params.set("type", types.join("-"));
            });
        } else {
            setSearchParams((params) => {
                params.delete("type");
            });
        }

        navigator(`../search?${searchParams.toString()}`, { replace: true });
        setCurrentSlice(100);

        activityList.forEach((activityDoc) => {
            let passedAllChecks = true;

            if (gradeList.length != 0 && passedAllChecks == true) {
                for (let index = 0; index < gradeList.length; index++) {
                    const grade = gradeList[index];

                    if (activityDoc.gradeRange == "unknown") {
                        passedAllChecks = false;
                        break;
                    }
                    if (!activityDoc.gradeRange.includes(grade)) {
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
                    ((cost[0] == "Free" && activityDoc.cost[1] == true) ||
                        (cost[0] == "Has fee" && activityDoc.cost[1] == false))
                ) {
                    passedAllChecks = false;
                } else if (cost.length == 2) {
                    passedAllChecks = true;
                } else {
                    passedAllChecks = true;
                }
            }

            if (locationValue.length != 0 && passedAllChecks == true) {
                for (let index = 0; index < locationValue.length; index++) {
                    const locationSelection = locationValue[index];
                    if (activityDoc.location.trim() == locationSelection.trim()) {
                        passedAllChecks = true;
                        break;
                    } else {
                        passedAllChecks = false;
                    }
                }
            }

            if (types.length != 0 && passedAllChecks == true) {
                for (let index = 0; index < types.length; index++) {
                    const type = types[index];
                    if (activityDoc.type == "unknown" || activityDoc.type == undefined || activityDoc.type == null) {
                        passedAllChecks = false;
                        break;
                    }
                    if (activityDoc.type.includes(type.trim())) {
                        passedAllChecks = true;
                        break;
                    } else {
                        passedAllChecks = false;
                    }
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

        if (searchValue != "" && searchValue != null && searchValue != undefined) {
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
            const fuse = new Fuse(filteredDocs, fuseOptions);
            const searchedDocs = fuse.search(searchValue).map((val) => {
                return val.item;
            });
            console.log(searchedDocs);
            setDocuments(searchedDocs);
        } else {
            setDocuments(filteredDocs);
        }
    };

    useEffect(() => {
        handleFilterAndSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Navbar />
            {documents ? (
                <div
                    className="searchDiv"
                    onKeyDown={(e) => {
                        if (e.key == "Enter") {
                            handleFilterAndSearch();
                        }
                    }}
                >
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
                                    onChange={(e) => {
                                        setSearchValue(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="row_two_filter">
                                <div className="age_filter_div">
                                    <MultiSelect
                                        className="filterInput"
                                        placeholder={gradeList.length == 0 ? "Grade" : undefined}
                                        searchable
                                        clearable
                                        hidePickedOptions
                                        data={["Freshman", "Sophomore", "Junior", "Senior"]}
                                        onChange={(e) => {
                                            setGradeList(e);
                                        }}
                                        value={gradeList}
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
                                    <MultiSelect
                                        className="filterInput"
                                        placeholder={locationValue.length == 0 ? "Location" : undefined}
                                        value={locationValue}
                                        onChange={(e) => {
                                            setLocationValue(e);
                                        }}
                                        data={locationArray}
                                        searchable
                                        clearable
                                        hidePickedOptions
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

                            <div className="row_seven_div">
                                <div className="tags_filter_div">
                                    <MultiSelect
                                        className="filterInput"
                                        placeholder={types.length == 0 ? "Types" : undefined}
                                        data={typesArray}
                                        value={types}
                                        onChange={(e) => {
                                            setTypes(e);
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
                                        handleFilterAndSearch();
                                    }}
                                >
                                    Search
                                </button>
                                <p className="resultsP">
                                    Showing {currentSlice} of {documents.length} results
                                </p>
                                <button
                                    className="loadMoreBtn"
                                    onClick={() => {
                                        setCurrentSlice((currSlice) => currSlice + 100);
                                    }}
                                >
                                    Load More
                                </button>
                            </div>
                        </div>
                        <div className="resultsDiv">
                            {documents.slice(0, currentSlice).map((document) => (
                                <Card_Search
                                    key={document.id}
                                    title={document.title}
                                    text={document.text}
                                    card_tag={document.tags != "unknown" ? document.tags : []}
                                    activity_cost={document.cost}
                                    selective_bool={document.selective}
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