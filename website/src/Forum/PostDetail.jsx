import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { projectFirestore } from '../firebase/config';
import { useDocument } from '../hooks/useDocument';
import Navbar from '../Navbar/Navbar';
const documentDetail = () => {
  const { id } = useParams();
  console.log(id)
  const {document,isPending,error}=useDocument('posts',id)
  

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (

    
    <div>
        <Navbar></Navbar>
        { document && <> 
      <h1>document Detail</h1>
      <p>Title: {document.title}</p>
      <p>Text: {document.text}</p>
      <p>Type: {document.type}</p>
      <p>Location: {document.location}</p>
      <p>Creator: {document.creator}</p>
      <p>Time: {document.time && document.time.toDate().toLocaleString()}</p></>}
    </div>
  );
};

export default documentDetail;
