import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jkuatlogo from "../images/jkuatlogo.jpeg";

//importing backend route
import { URL } from "../App";

function Login() {
    const [errors, setErrors] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: "",
    });

    function handleChange(event) {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    }

    //submission
    async function handleSubmit(event) {
        event.preventDefault();
        if (!data.email || !data.password) {
            setErrors("Email and password are required!");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post(`${URL}/api/auth/login`, data, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.data.token) {
                toast.success("Logged in Successfully");
                console.log(response)
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data.role); // Set the user's role in local storage
                // Redirect based on user's role
                if (response.data.role === 'admin') {
                    window.location.href = "/dashboard";
                } else {
                    window.location.href = "/";
                }
            } else {
                toast.error("Invalid email or password");
            }
        } catch (error) {
            // Handle login errors
            if (error.response && error.response.status === 401) {
                toast.error("Invalid email or password");
                setErrors('Invalid email or password');
            } else {
                console.error(error);
                toast.error("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }
    
    

    return (
        <>
            <div className='flex justify-center items-center h-screen'>
                <div className='w-full max-w-md'>
                    <form onSubmit={handleSubmit} className='bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4'>
                        <div className="text-center mb-8">
                            <img src={jkuatlogo} alt="jkuat logo" className="h-16 mx-auto rounded-full" />
                            <h1 className="text-3xl font-bold">LOGIN</h1>
                        </div>
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>Email:</label>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' type="email" name="email" placeholder='Your email' onChange={handleChange} />
                        </div>
                        <div className='mb-6'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>Password:</label>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' type="password" name="password" placeholder='Password' onChange={handleChange} />
                        </div>
                        <p className="text-red-500 text-xs italic">{errors}</p>
                        <div className='flex items-center justify-center'>
                            <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                {loading ? "Loading" : "LOGIN"}
                            </button>
                        </div>
                    </form>
                    <div className="text-center">
                        <p className="text-gray-600 text-xs italic">Don't have an account? <Link to="/signup" className="text-blue-500 hover:text-blue-800">Register</Link> | <Link to="/forgot-password" className="text-blue-500 hover:text-blue-800">Forgot password</Link></p>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Login;
