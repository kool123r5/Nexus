import { Loader, MultiSelect, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useState } from "react";
import HomeSection from "../HomeSection/HomeSection";
import Navbar from "../Navbar/Navbar";
import getUniqueTypes from "../functions/getUniqueTypes";
import "./Home.css";
import tagArray from "../Signup/tagArray";
import { IconSearch } from "@tabler/icons-react";
import activityList from "../List/activities";
import Fuse from "fuse.js";

export default function Home() {
    const [mode, setMode] = useState([]);
    const [ageList, setAgeList] = useState([]);
    const [cost, setCost] = useState([]);
    const [date, setDate] = useState([]);
    const [tags, setTags] = useState([]);
    const [errorGettingLocation, setErrorGettingLocation] = useState(null);
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

    const handleLocationClick = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setErrorGettingLocation(null);
                setLocationValue(`${position.coords.latitude.toPrecision(3)}, ${position.coords.longitude.toPrecision(3)}`);
            },
            () => {
                setErrorGettingLocation(
                    "Error getting your location. Please try entering a general location manually or leaving it blank"
                );
            }
        );
    };

    let uniqueTypeArr = null;
    if (documents) {
        uniqueTypeArr = getUniqueTypes(documents);
    }

    return (
        <>
            <Navbar />
            {documents ? (
                <div className="homeDiv">
                    <div className="filterDiv">
                        <TextInput
                            className="filterInput searchBar"
                            placeholder="Search"
                            leftSection={<IconSearch />}
                            leftSectionWidth={40}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
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
                        <TextInput
                            className="filterInput"
                            placeholder="Ages. Eg: 9, 10, 13"
                            type="text"
                            min={13}
                            max={22}
                            error={errorAge}
                            onChange={(e) => {
                                setErrorAge(null);
                                const numberArray = e.target.value.split(",").map(Number);
                                if (numberArray.includes(NaN)) {
                                    setErrorAge("Enter valid ages");
                                } else if (numberArray.includes(0) && numberArray[numberArray.length - 1] != 0) {
                                    setErrorAge("Enter valid ages");
                                } else if (numberArray.some((num) => num < 13)) {
                                    setErrorAge("Ages must be at least 13!");
                                } else {
                                    if (numberArray[numberArray.length - 1] == 0) {
                                        setAgeList([...numberArray].slice(0, -1));
                                    } else {
                                        setAgeList(numberArray);
                                    }
                                }
                            }}
                        />
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
                        <DatePickerInput
                            className="filterInput"
                            type="range"
                            placeholder="Date Range"
                            allowSingleDateInRange
                            value={date}
                            onChange={(e) => {
                                setDate(e);
                            }}
                        />
                        <TextInput
                            className="filterInput"
                            placeholder="Location"
                            onFocus={handleLocationClick}
                            value={locationValue}
                            error={errorGettingLocation}
                            onChange={(e) => {
                                setErrorGettingLocation(null);
                                setLocationValue(e.target.value);
                            }}
                        />
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
                        <button onClick={handleFilter}>Apply Filters</button>
                        <button onClick={handleSearch}>Search</button>
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
