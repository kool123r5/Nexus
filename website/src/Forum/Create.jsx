import React, { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { projectFirestore } from '../firebase/config';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from "react-router-dom";

const Create = () => {

  const { user } = useAuthContext(); 
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const navigateTo =useNavigate()
  

  const handleCreatePost = async () => {
    try {
      const currentDate = new Date();
      const userId = user.uid; 
      
      const postsCollection = projectFirestore.collection('posts');
      const likes = 0;

      await postsCollection.add({
        title,
        text,
        type,
        likes,
        location,
        creator: userId,
        time: currentDate,
      });

      setTitle('');
      setText('');
      setType('');
      navigateTo('/forum')

    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <>
    <Navbar></Navbar>
    <div>
      <h1>Create Post</h1>
      <form>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Text:</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} />

        <label>Type:</label>
        <input type="text" value={type} onChange={(e) => setType(e.target.value)} />

        <label>Location:</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />

        {/* You may also display the current user's information if needed */}
        <p>Created by: {user.displayName || user.email}</p>

        <button type="button" onClick={handleCreatePost}>
          Create Post
        </button>
      </form>
    </div>
    </>
  );
};

export default Create;
