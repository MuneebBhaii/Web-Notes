import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { createUserWithEmailAndPassword } from "firebase/auth";
import {doc , setDoc} from 'firebase/firestore'
import { auth, firestore } from '../../config/firebase';
import { message } from 'antd';
const initialization = {  email: "", password: "" , fullNames:"", number:"" }
export default function Register() {

    const [state, setState] = useState(initialization)
    const handleChange = e => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(state)
        const { email , password , fullName , number } = state
       if (fullName.length < 3){
            message.error("Full Name enter")
            return
        } else if (number.length !== 11) {
            message.error("Number must be 11 characters")
            return
        }else if(password.length < 6){
            message.error("password must be 6 characters")
            return
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                message.success("user register successfully")
                console.log(user)
                try {
                    setDoc(doc(firestore, "users", user.uid),{email: user.email , id : user.uid });
                  } catch (e) {
                    console.error("Error adding document: ", e);
                  }
            })
            .catch((error) => {
                console.error(error)
                message.error("Email Already Registered");
            });
    }
    return (
        <main className='Authbg'>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                        <div className="card p-2 p-md-3 p-lg-4">
                            <h2 className='text-center mb-4 text-white'>Register Form</h2>
                            <form onSubmit={handleSubmit}>

                                <div className="row mb-2">
                                    <div className="col">
                                        <label htmlFor="fullName" className='text-white'>Full Name</label>
                                        <input type="text" className='form-control' placeholder='Full Name' name='fullName' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col">
                                        <label htmlFor="email" className='text-white'>Email</label>
                                        <input type="email" className='form-control' placeholder='Email' name='email' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col">
                                        <label htmlFor="date " className='text-white'>Date-of-Birth</label>
                                        <input type="date" className='form-control' name='date' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col">
                                        <label htmlFor="number" className='text-white'>Number</label>
                                        <input type="number" className='form-control' placeholder='Phone Number' name='number' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="password" className='text-white'>Password</label>
                                        <input type="text" className='form-control' placeholder='Password' name='password' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <button className='btn btn-outline-primary w-100' >Register</button>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col text-center text-white">
                                        Already have account <Link to="/Auth/Login"><u className='text-white fw-bold'>Login</u></Link>
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
