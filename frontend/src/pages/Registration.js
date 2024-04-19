import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//importing backend route
import { URL } from "../App";
import jkuatlogo from "../images/jkuatlogo.jpeg";
import { HiPhoto } from "react-icons/hi2";

function Registration() {
    const [firstname, setfirstname] = useState('');
    const [lastname, setlastname] = useState('');
    const [phone, setphone] = useState('');
    const [email, setEmail] = useState('');
    const [KRA, setKRA] = useState('');
    const [error, setError] = useState("");
    const [MaritalStatus, setMaritalStatus] = useState('');
    const [department, setDepartment] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [MarriageCertificate, setMarriageCertificate] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [showMarriageCertificate, setShowMarriageCertificate] = useState(true);
    const [loading, setLoading] = useState(false);

    //error handlers on states
    const [nationalID, setNationalID] = useState('');
    const [isValid, setisValid] = useState(true);
    const [isValidKRA, setValidKRA] = useState(true);
    const [isValidEmail, setisValidEmail] = useState(true);
    const [idError, setIdError] = useState(true);
    const [passwordError, setPasswordError] = useState(true);
    const [Message, setMessage] = useState('');
    //firstname
    function handleFirstname(event) {
        const inputValue = event.target.value
        setfirstname(inputValue);
    }
    //lastname
    function handleLastname(event) {
        const inputValue = event.target.value
        setlastname(inputValue);
    }
    //phone 
    function handlePhone(event) {
        const inputvalue = event.target.value;
        setphone(inputvalue);
        const phoneRegex = /^(\+\d{1,3})?(\s*[(.-]?\d{3}[).-]?\s*|\s*\d{3}\s*)([.-]?\d{3}[.-]?\s*|\s*\d{3}\s*)([.-]?\d{4}[.-]?\s*|\s*\d{4}\s*)$/;
        setisValid(phoneRegex.test(inputvalue));
    }
    //email
    function handleEmail(event) {
        const inputValue = event.target.value;
        setEmail(inputValue);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setisValidEmail(emailRegex.test(inputValue));
    }
    //national id
    function handlNationalID(event) {
        const inputValue = event.target.value;
        setNationalID(inputValue);
        //id format number (accepting 8 digits)
        const numberRegex = /^\d{8}$/;
        setIdError(numberRegex.test(inputValue));

    }
    //kra pin 
    function handleKRA(event) {
        const inputValue = event.target.value;
        setKRA(inputValue);
        const kraRegex = /^[a-zA-Z0-9]+$/;
        kraRegex.test(setValidKRA(inputValue));
    }

    //marriage certificate
    function handleMarriageCertificate(event) {
        const selectedStatus = event.target.value;
        setMaritalStatus(selectedStatus);
        setShowMarriageCertificate(selectedStatus === 'married');
    }

    //department
    function handleDepartment(event) {
        const selectedDepartment = event.target.value;
        setDepartment(selectedDepartment);
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

    //marriageCertificate
    function handlemarriageCertificatefile(event) {
        const SelectedFile = event.target.files[0];
        const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (SelectedFile && allowedImageTypes.includes(SelectedFile.type)) {
            setMarriageCertificate(SelectedFile);
        }

    }


    //submission event
    async function handleSubmit(event) {
        event.preventDefault();
        if (!firstname || !lastname || !password || !confirmPassword || !phone || !email || !nationalID || !KRA || !department) {
            setError('All fields are required');
        }
        try {

            setLoading(true);
            const response = await axios.post(`${URL}/api/users/signup`, {
                firstname,
                lastname,
                phone,
                email,
                nationalID,
                KRA,
                MaritalStatus,
                department,
                password,
                MarriageCertificate
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
                setDepartment("");
                setEmail("");
                setError("");
                setNationalID("");
                setPassword('');
                setfirstname('');
                setKRA('');
                setlastname('')
                setphone("");
                setMaritalStatus('');
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
                    <h1 className="text-3xl font-bold">REGISTRATION</h1>
                </div>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className='space-y-4'>
                    <div>
                        <label className='block mb-2'>First Name</label>
                        <input type='text' name='firstname' placeholder='firstname' value={firstname} onChange={handleFirstname} className="w-full border border-gray-400 p-2 rounded-md" required />
                    </div>
                    <div>
                        <label className='block mb-2'>Last Name</label>
                        <input type='text' name='lastname' placeholder='lastname' value={lastname} onChange={handleLastname} className="w-full border border-gray-400 p-2 rounded-md" required />
                    </div>

                    <div>
                        <label className='block mb-2'>Phone</label>
                        <input type="tel" name="phone" placeholder='Phone' value={phone} onChange={handlePhone} className="w-full border border-gray-400 p-2 rounded-md" required />
                        {!isValid && <p className="text-red-500 text-sm mt-1">Please enter a valid phone number</p>}
                    </div>
                    <div>
                        <label className='block mb-2'>Email</label>
                        <input type="email" name="email" placeholder='Your Email' value={email} onChange={handleEmail} className="w-full border border-gray-400 p-2 rounded-md" required />
                        {!isValidEmail && <p className="text-red-500 text-sm mt-1">Please enter a valid email</p>}
                    </div>

                    <div>
                        <label className='block mb-2'>National ID</label>
                        <input type="text" name="nationalID" placeholder='Enter numbers only e.g., 12345678' value={nationalID} onChange={handlNationalID} className="w-full border border-gray-400 p-2 rounded-md" required />
                        {!idError && <p className="text-red-500 text-sm mt-1">Please enter a valid ID number</p>}
                    </div>
                    <div>
                        <label className='block mb-2'>KRA PIN</label>
                        <input type="text" name="KRA-PIN" placeholder='KRA PIN' value={KRA} onChange={handleKRA} className="w-full border border-gray-400 p-2 rounded-md" required />
                        {!isValidKRA && <p className="text-red-500 text-sm mt-1">Enter a valid KRA pin</p>}
                    </div>
                    <div>
                        <label className='block mb-2'>Marital Status</label>
                        <select name="maritalStatus" value={MaritalStatus} onChange={handleMarriageCertificate} className="w-full border border-gray-400 p-2 rounded-md" required>
                            <option value="married">Married</option>
                            <option value="single">Single</option>
                        </select>
                    </div>
                    {/* Marriage certificate if married */}
                    {showMarriageCertificate && <div className='mt-5'>
                        <label htmlFor="insuranceImage" className="grid text-sm font-medium leading-12 text-gray-900">Upload Marriage Certificate</label>
                        <div className="p-2 mt-2 flex items-center justify-center flex-col border border-dashed border-gray-400 rounded-lg py-8 px-6">
                            <label htmlFor="MarriageCertificate" className="flex items-center justify-center rounded-md font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <HiPhoto className="h-8 w-8 mr-2" />
                                Upload a file
                                <input id="MarriageCertificate" name="MarriageCertificate" type="file" className="sr-only" onChange={handlemarriageCertificatefile} />
                            </label>
                            <p className="mt-2 text-xs text-gray-600">PNG, JPG or JPEG only, up to 10MB</p>
                        </div>
                    </div>}

                    <div>
                        <label className='block mb-2'>Choose Department</label>
                        <select name="department" onChange={handleDepartment} value={department} className="w-full border border-gray-400 p-2 rounded-md" required>
                            <option>Select Department</option>
                            <option value="IT">IT</option>
                            <option value="HR">HR</option>
                            <option value="Finance">Finance</option>
                        </select>
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
                <div><p className='text-center'>Already have an account? <Link to="/Login" className="text-blue-500">Login</Link></p></div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Registration;


