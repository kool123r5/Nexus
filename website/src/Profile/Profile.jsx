import Navbar from "../Navbar/Navbar";
import "./Profile.css";
import { useDocument } from "../hooks/useDocument";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

export default function Profile() {
    const { id } = useParams();
    const { document, error } = useDocument("users", id);
    const [activity,setActivity]=useState(null)

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;


  const fetchActivities = async () => {
    if (document && document.activities) {
      // Extract activity references

      const activityDocsPromises = document.activities.map(async activity => {
        const activityRef = activity.activity;
        const activityDocSnapshot = await activityRef.get();
        const activityDocData = activityDocSnapshot.data();
        return {
          ...activityDocData,
          completed: activity.completed,
          startDate:activity.startDate,
          rating:activity.rating,
          comment:activity.comment,
          endDate:activity.endDate,
        };
      });

      const activityDocs = await Promise.all(activityDocsPromises);
      console.log(activityDocs)
      setActivity(activityDocs)
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
    
  
    
    return (
        <>
            <Navbar />
            {error && <p>{error}</p>}
            <p>{id}</p>

            {document && (
                <div>
                    Profile
                    <p>Welcome: {document.displayName}</p>
                    <br></br>
                    <p>Your activities</p>
                      {document.activities && <p>Will map through</p>}
                      {!document.activities && <p>No activities yet</p>}
                    <p>Other info.....</p>
                </div>
            )}
        </>
    );
}
