import Navbar from "../Navbar/Navbar";
import "./Profile.css";
import { useDocument } from "../hooks/useDocument";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import ProjectFilter from "../Filter/ProjectFilter";

export default function Profile() {
    const { id } = useParams();
    const { document, error } = useDocument("users", id);
    const [activities, setActivities] = useState(null);
    const [filter, setFilter] = useState("All");

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const fetchActivities = async () => {
        if (document && document.activities) {
            // Extract activity references

            const activityDocsPromises = document.activities.map(async (activity) => {
                const activityRef = activity.activity;
                const activityDocSnapshot = await activityRef.get();
                const activityDocData = activityDocSnapshot.data();
                return {
                    ...activityDocData,
                    completed: activity.completed,
                    startDate: activity.startDate,
                    rating: activity.rating,
                    comment: activity.comment,
                    endDate: activity.endDate,
                };
            });

            const activityDocs = await Promise.all(activityDocsPromises);
            console.log(activityDocs);
            setActivities(activityDocs);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [document]);

    const changeFilter = (newFilter) => {
        setFilter(newFilter);
    };

    const changeSearchQuery = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredActivities = activities
        ? activities.filter((document) => {
              switch (filter) {
                  case "All":
                      return true;
                  case "Completed":
                  case "Pending":
                      return document.completed === filter;
                  default:
                      return true;
              }
          })
        : null;

    const searchedActivities = filteredActivities
        ? filteredActivities.filter((document) => document.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : null;

    const lastRowIndex = currentPage * rowsPerPage;
    const firstRowIndex = lastRowIndex - rowsPerPage;
    const currentActivities = searchedActivities ? searchedActivities.slice(firstRowIndex, lastRowIndex) : null;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil((searchedActivities?.length || 0) / rowsPerPage);

    return (
        <>
            <Navbar />
            {error && <p>{error}</p>}
            <p>{id}</p>

            {document && (
                <div>
                    Profile
                    <ProjectFilter changeFilter={changeFilter} />
                    <input type="text" value={searchQuery} onChange={changeSearchQuery} placeholder="Search by name" />
                    <p>Welcome: {document.displayName}</p>
                    <br></br>
                    <p>Your activities</p>
                    {currentActivities &&
                        currentActivities.map((document) => {
                            console.log(document);
                            return (
                                <>
                                    <Link to={`/activity/${document.uid}`}>
                                        <p key={Math.random()}>{document.title}</p>{" "}
                                    </Link>
                                </>
                            );
                        })}
                    {!currentActivities && <p>No activities yet</p>}
                    <br />
                    <Link to={"/profile/settings"}>
                        <button>Settings</button>
                    </Link>
                    {/* 
                    <pagination className="mt-3">
            {Array.from({ length: totalPages }).map((_, index) => (
              <item
                key={index}
                active={currentPage === index + 1}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </item>
            ))}
          </pagination>  */}
                </div>
            )}
        </>
    );
}
