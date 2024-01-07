import Navbar from "../Navbar/Navbar";
import "./Signup.css";
import { useState } from "react";
import { useSignupInfo } from "../hooks/useSignupInfo";
import useGoogleSignIn from "../hooks/useGoogleSignIn";

export default function Signup2() {
  const [age, setAge] = useState(null);
  const [grade, setGrade] = useState(null);
  const [location, setLocation] = useState(null);
  const [interests, setInterests] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);

  const { signup2, isPending, error } = useSignupInfo();

  const handleSubmit = async (e) => {
    e.preventDefault();
   
      signup2(
        age,
        grade,
        location,
        interests,
        profilePicture
      )
  };

  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Age:{" "}
          <input
            type={"number"}
            onChange={(e) => setAge(e.target.value)}
          ></input>
        </label>

        <label>
          Grade (6-12):{" "}
          <input
            type={"number"}
            onChange={(e) => setGrade(e.target.value)}
          ></input>
        </label>

        <label>
          Location:{" "}
          <input
            type={"text"}
            onChange={(e) => setLocation(e.target.value)}
          ></input>
        </label>
        <br />
        <label>
          Interests:{" "}
          <input
            type={"text"}
            onChange={(e) => setInterests(e.target.value)}
          ></input>
        </label>
        <label>
          Profile Picture:{" "}
          <input
            type={"file"}
            onChange={(e) => setProfilePicture(e.target.files[0])}
          ></input>
        </label>
        <button type="submit">Submit</button>

        {isPending && (
          <button className="btn" disabled>
            Loading...Do Not Refresh The Page
          </button>
        )}
        {error && <div className="error">{error}</div>}
        
      </form>
    </div>
  );
}
