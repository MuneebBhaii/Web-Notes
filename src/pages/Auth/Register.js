import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { createUserWithEmailAndPassword } from "firebase/auth";
import {doc , setDoc} from 'firebase/firestore'
import { auth, firestore } from '../../config/firebase';
const initialization = {  email: "", password: "" }
export default function Register() {

    const [state, setState] = useState(initialization)
    const handleChange = e => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(state)
        const { email , password  } = state
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log("user register successfully")
                console.log(user)
                try {
                    setDoc(doc(firestore, "users", user.uid),{email: user.email , id : user.uid });
                  } catch (e) {
                    console.error("Error adding document: ", e);
                  }
            })
            .catch((error) => {
                console.error(error)
            });
    }
    return (
        <main className='bg-secondary'>
            {/* <div className="py-2 w-100"> */}
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                        <div className="card p-2 p-md-4 p-lg-5">
                            <h2 className='text-center mb-4'>Register Form</h2>
                            <form onSubmit={handleSubmit}>

                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="fullName">Full Name</label>
                                        <input type="text" className='form-control' placeholder='Full Name' name='fullName' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" className='form-control' placeholder='Email' name='email' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="date">Date-of-Birth</label>
                                        <input type="date" className='form-control' name='date' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="number">Number</label>
                                        <input type="number" className='form-control' placeholder='Phone Number' name='number' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="password">Password</label>
                                        <input type="text" className='form-control' placeholder='Password' name='password' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <button className='btn btn-outline-success w-100' >Register</button>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col text-center">
                                        Already have account <Link to="/Auth/Login"><u className='text-dark fw-bold'>Login</u></Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* </div> */}
        </main>
    )
}
