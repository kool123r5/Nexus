import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import { projectFirestore } from '../firebase/config';
import { useDocument } from '../hooks/useDocument';
import Navbar from '../Navbar/Navbar';
import { useAuthContext } from '../hooks/useAuthContext';
const documentDetail = () => {
  const { id } = useParams();
  console.log(id)
  const {user,authIsReady}=useAuthContext()
  const [post, setPost] = useState(null);
  const [editable, setEditable] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedText, setUpdatedText] = useState('');
  const [updatedType, setUpdatedType] = useState('');
  const [updatedLocation, setUpdatedLocation] = useState('');
  const {document,isPending,error}=useDocument('posts',id)
  const [fetch,setFetch]=useState(false)
  const navigateTo=useNavigate()
  
  useEffect(() => {
    const fetchPost = async () => {
         
        if (!fetch && document && user && user.uid === document.creator) {
            setEditable(true);
            setUpdatedTitle(document.title);
            setUpdatedText(document.text);
            setUpdatedType(document.type);
            setUpdatedLocation(document.location);
            setFetch(true)
          }

    }

    fetchPost(), [user,document]});


  const handleUpdatePost = async () => {
    try {
      // Add your Firebase configuration here
     
      const postRef = projectFirestore.collection('posts').doc(id);

      await postRef.update({
        title: updatedTitle,
        text: updatedText,
        type: updatedType,
        location: updatedLocation,
      });

      setPost((prevPost) => ({
        ...prevPost,
        title: updatedTitle,
        text: updatedText,
        type: updatedType,
        location: updatedLocation,
      }));

      setEditable(true);
      setUpdatedTitle('');
      setUpdatedText('');
      setUpdatedType('');
      setUpdatedLocation('');

      // You can also add a success message or navigate to another page upon successful update
    } catch (error) {
      console.error('Error updating post:', error);
      // Handle error, show error message, etc.
    }
  };

  const handleDeletePost = async () => {
    try {
      const postRef = projectFirestore.collection('posts').doc(id);
      await postRef.delete();
      // Redirect to '/forum' after successful deletion
      navigateTo('/forum');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };


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

      {editable && (
        <div>
          <h2>Edit Post</h2>
          <form>
            <label>Title:</label>
            <input type="text" value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} />

            <label>Text:</label>
            <textarea value={updatedText} onChange={(e) => setUpdatedText(e.target.value)} />

            <label>Type:</label>
            <input type="text" value={updatedType} onChange={(e) => setUpdatedType(e.target.value)} />

            <label>Location:</label>
            <input type="text" value={updatedLocation} onChange={(e) => setUpdatedLocation(e.target.value)} />

            <button type="button" onClick={handleUpdatePost}>
              Update Post
            </button>
            <button type="button" onClick={handleDeletePost}>
                Delete Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default documentDetail;
