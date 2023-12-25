import Card from "../Card/CardGrid";
import Navbar from "../Navbar/Navbar";
import "./Home.css";
import { useCollection } from "../hooks/useCollection";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";
import { useEffect } from "react";
export default function Home() {
  let collection = useCollection("activities");
  let title = [];

  const { user } = useAuthContext();
  const [isUser, setIsUser] = useState(false);

  if (user && isUser == false) {
    setIsUser(true);
  }
  let text = [];
  let type = [];
  if (collection.error != null) {
    console.log("ERROR FETCHING DOCUMENTS");
  }
  let array_of_documents = collection.documents;
  if (array_of_documents != null) {
    array_of_documents.forEach((document) => {
      title.push(document.title);
      text.push(document.text);
      type.push(document.type);
    });
  }

  return (
    <>
      <Navbar />
      <div>Home</div>
      {user && <p>Welcome: {user.displayName}</p>}
    </>
  );
}
