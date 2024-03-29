import { Input, Loader, MultiSelect, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import HomeSection from "../HomeSection/HomeSection";
import Navbar from "../Navbar/Navbar";
import getUniqueTypes from "../functions/getUniqueTypes";
import sortDocuments from "../functions/sortDocuments";
import { useCollection } from "../hooks/useCollection";
import "./Home.css";

export default function Home() {
    const [sorted_documents, setSortedDocuments] = useState(null);
    const [mode, setMode] = useState([]);
    const [age, setAge] = useState("");
    const [cost, setCost] = useState([]);
    const [date, setDate] = useState([]);
    const [errorGettingLocation, setErrorGettingLocation] = useState(null);
    const [locationValue, setLocationValue] = useState("");

    // when we make the model, change the query to reflect the type the user would actually want to see
    const limit = 30; // the limit of how many documents to get (we don't wanna get hundreds extra when we don't need it)
    const { documents, error } = useCollection("activities", null, null, limit, "ActivityDocuments");

    useEffect(() => {
        if (error) {
            console.log("ERROR FETCHING DOCUMENTS");
        } else if (documents) {
            const sortedDocs = sortDocuments(documents);
            setSortedDocuments(sortedDocs);
        }
    }, [documents, error]);

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
    if (sorted_documents) {
        uniqueTypeArr = getUniqueTypes(sorted_documents);
    }

    return (
        <>
            <Navbar />
            {documents ? (
                <div className="homeDiv">
                    <div className="filterDiv">
                        <MultiSelect
                            className="filterInput"
                            placeholder={mode.length == 0 ? "Mode" : undefined}
                            data={["In Person", "Remote / Online", "Hybrid"]}
                            value={mode}
                            onChange={(e) => setMode(e)}
                            searchable
                            clearable
                            hidePickedOptions
                        />
                        <Input
                            className="filterInput"
                            placeholder="Age"
                            type="number"
                            min={13}
                            max={22}
                            value={age}
                            onChange={(e) => setAge(e)}
                        />
                        <MultiSelect
                            className="filterInput"
                            placeholder={cost.length == 0 ? "Cost" : undefined}
                            data={["Free", "Has fee"]}
                            value={cost}
                            onChange={(e) => setCost(e)}
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
                    </div>
                    {uniqueTypeArr != null
                        ? uniqueTypeArr.map((uniqueTypeObj) => {
                              return (
                                  <HomeSection
                                      key={uniqueTypeObj + Math.random()}
                                      uniqueTypeObj={uniqueTypeObj}
                                      sorted_documents={sorted_documents}
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
