import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword , onAuthStateChanged } from "firebase/auth";
import { auth } from '../../config/firebase';
import { message } from 'antd';
const initialization = { email: "", password: "" }
export default function Login() {
    const [state, setState] = useState(initialization)
    const nevigate = useNavigate()
    const handleChange = e => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(state)
        const { email , password  } = state
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                message.success(" login successfully")
                console.log(user)
                nevigate("/")
            })
            .catch((error) => {
                console.error(error)
                message.error("You have no account")
            });
    }

    return (
        <main className='bg-secondary'>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                        <div className="card p-2 p-md-4 p-lg-5">
                            <h2 className="text-center mb-4">Login Form</h2>
                            <form onSubmit={handleSubmit}>

                                <div className="row mb-3">
                                    <div className="col">
                                        <input type="email" className="form-control" placeholder='Email' name='email' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <input type="password" className="form-control" placeholder='Password' name='password' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <button className='btn btn-outline-success w-100'>Login</button>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col text-center">
                                        Create new account <Link to="/Auth/Register"><u className='text-dark fw-bold'>Register</u></Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
