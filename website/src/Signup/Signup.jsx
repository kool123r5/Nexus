import Navbar from "../Navbar/Navbar";
import "./Signup.css";
import { useState } from 'react'
import { useSignup } from '../hooks/useSignup'


export default function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState(null)
    const [displayName, setName] = useState('')
    const { signup, isPending, error } = useSignup()


    
  const handleSubmit = async (e) => {
    e.preventDefault()
    signup(email, password, displayName)
  }

    return (
        <>
            <Navbar />
            <div>Sign Up
                
            <form onSubmit={handleSubmit} >

                <label>Name: <input type="text"  onChange={(e) => setName(e.target.value)} ></input></label>
                <label>Email: <input type="email"  onChange={(e) => setEmail(e.target.value)} ></input></label>

                <label>Password: <input type="password"  onChange={(e) => setPassword(e.target.value)} ></input></label>

            <button type="submit">Submit</button>

            {isPending && <button className="btn" disabled>Loading...Do Not Refresh The Page</button>}
            {error && <div className="error">{error}</div>}
            </form>
            </div>  
        </>
    );
}
