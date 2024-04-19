import React, { useState } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//importing backend route
import { URL } from "../../App";
import jkuatlogo from "../../images/jkuatlogo.jpeg";
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [username, setusername] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState("");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [loading, setLoading] = useState(false);

    //error handlers on states
    const [isValidEmail, setisValidEmail] = useState(true);
    const [passwordError, setPasswordError] = useState(true);
    const [Message, setMessage] = useState('');

    const navigate = useNavigate();
    //firstname
    function handleUsername(event) {
        const inputValue = event.target.value
        setusername(inputValue);
    }

    //email
    function handleEmail(event) {
        const inputValue = event.target.value;
        setEmail(inputValue);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setisValidEmail(emailRegex.test(inputValue));
    }


    //password
    function handlePassword(event) {
        const inputValue = event.target.value;
        setPassword(inputValue);
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        setPasswordError(passwordRegex.test(inputValue));
    }

    //confirm password
    function handleConfirmPassword(event) {
        const inputValue = event.target.value;
        setConfirmPassword(inputValue)
        setPasswordMatch(inputValue === password);
    }


    //submission event
    async function handleSubmit(event) {
        event.preventDefault();
        if (!username || !password || !confirmPassword || !email) {
            setError('All fields are required');
        }
        try {

            setLoading(true);
            const response = await axios.post(`${URL}/api/admin/signup`, {
                username,
                email,
                password,
            }, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 201) {
                toast.success(response.data.message);
                setMessage(response.data.message);
                //reseting the fields upon successfully submission of documents
                setConfirmPassword("");
                setEmail("");
                setError("");
                setPassword('');
                setusername('');
                navigate("/signin");
            }

        } catch (error) {
            console.error("Error:", error);
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message);
            } else if (error.response && error.response.status === 500) {
                toast.error('Server error. Please try again later.');
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);
        }

    }
    return (
        <>
            <div className='items-center justify-center max-w-lg mx-auto p-6 bg-white rounded-md shadow-md mt-24 mb-24'>
                <div className="text-center mb-8">
                    <img src={jkuatlogo} alt="jkuat logo" className="h-16 mx-auto rounded-full" />
                    <h1 className="text-3xl font-bold">ADMIN SIGNUP</h1>
                </div>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className='space-y-4'>
                    <div>
                        <label className='block mb-2'>User Name</label>
                        <input type='text' name='username' placeholder='username' value={username} onChange={handleUsername} className="w-full border border-gray-400 p-2 rounded-md" required />
                    </div>

                    <div>
                        <label className='block mb-2'>Email</label>
                        <input type="email" name="email" placeholder='Your Email' value={email} onChange={handleEmail} className="w-full border border-gray-400 p-2 rounded-md" required />
                        {!isValidEmail && <p className="text-red-500 text-sm mt-1">Please enter a valid email</p>}
                    </div>
                    <div>
                        <label className='block mb-2'>Password</label>
                        <input type="password" name="password" placeholder='Password' value={password} onChange={handlePassword} className="w-full border border-gray-400 p-2 rounded-md" required />
                        {!passwordError && <p className="text-red-500 text-sm mt-1">Password requires at least 1 lowercase letter, 1 uppercase letter, at least one digit, one special character, and a minimum length of eight characters</p>}
                    </div>
                    <div>
                        <label className='block mb-2'>Confirm Password</label>
                        <input type="password" name="confirmPassword" placeholder='Confirm Password' value={confirmPassword} onChange={handleConfirmPassword} className="w-full border border-gray-400 p-2 rounded-md" required />
                        {!passwordMatch && <p className="text-red-500 text-sm mt-1">Passwords don't match</p>}
                    </div>
                    <div className='flex items-center justify-center'>
                        <button type="submit" disabled={!passwordMatch || loading} className="text-center sm:w-auto bg-blue-500 text-white font-semibold py-2 px-8 rounded-md cursor-pointer">{loading ? "loading..." : "Register"}</button>
                    </div>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {Message && <p style={{ color: 'green' }}>{Message}</p>}

            </div>
            <ToastContainer />
        </>
    )
}

export default Signup;


