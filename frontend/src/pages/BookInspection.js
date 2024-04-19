import React, { useState } from 'react';
import axios from 'axios';
import { URL } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jkuatlogo from "../images/jkuatlogo.jpeg";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function BookInspection() {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    //handling change
    function handleDate(event) {
        const inputValue = event.target.value;
        setDate(inputValue);
    }

    function handleTime(event) {
        const inputValue = event.target.value;
        setTime(inputValue);
    }

    function handleLocation(event) {
        const inputValue = event.target.value;
        setLocation(inputValue);
    }


    //booking function
    const handleBooking = async function (event) {
        event.preventDefault();
        try {
            const token = localStorage.getItem("token");
            //get userId from token
            if (!token) {
                navigate("/login");
            }
            const decoded = jwtDecode(token);
            const id = decoded._id;
            const formdata = new FormData();
            formdata.append("date", date);
            formdata.append("time", time);
            formdata.append("location", location);
            formdata.append("userId", id);
            const response = await axios.post(`${URL}/api/users/book-inspection/${id}`, formdata, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "x-access-token": token
                }
            });
            if (response.status === 201) {
                alert("Booked Inspection successfully!")
                toast.success("Booked Inspection successfully!");
                navigate("/");
            }

        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error(error.response.data.message);
            } else if (error.response && error.response.status === 500) {
                toast.error('Server error. Please try again later.');
            } else {
                toast.error('An unexpected error occurred. Please try again later!');
            }
        } finally {
            setLoading(false);
        }

    }

    return (
        <div>
            <form action='api/book-inspection' method='post' style={{ backgroundColor: "#F1FADA", marginTop: "8rem" }} className="mx-auto max-w-4xl p-3 items-center justify-center mt-10" encType="multipart/form-data" onSubmit={handleBooking}>
                {/* jkuat logo */}
                <div className="text-center mb-8">
                    <img src={jkuatlogo} alt="jkuat logo" className="h-16 mx-auto rounded-full" />
                    <h1 className="text-3xl font-bold">Book Inspection</h1>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 justify-center items-center max-w-2xl mx-auto">
                    <div>
                        <div className='mt-5'>
                            <label htmlFor="date" className="grid text-sm font-medium leading-6 text-gray-900">Select Inspection Date</label>
                            <input id='date' type='date' name="date" value={date} onChange={handleDate} className="p-2 mt-2 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Inspection Date"></input>
                        </div>
                        <div className='mt-5'>
                            <label htmlFor="time" className="grid text-sm font-medium leading-6 text-gray-900">Inspection time</label>
                            <input id='time' type='time' name="time"
                                value={time}
                                onChange={handleTime}
                                className="p-2 mt-2 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder='Inspection Time'></input>
                        </div>

                        <div className='mt-5'>
                            <label htmlFor="location" className="grid text-sm font-medium leading-6 text-gray-900">Location</label>
                            <input id='location' type='text' name="location"
                                value={location}
                                onChange={handleLocation}
                                className="p-2 mt-2 block w-full h-10 border-gray rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder='Inspection Location'></input>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-center">
                    <button type="submit" disabled={loading} className="w-full sm:w-auto bg-indigo-600 px-6 py-3 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {loading ? "Loading" : "Book Inspection"}
                    </button>
                </div>
                <ToastContainer />
            </form>
        </div>
    )
}

export default BookInspection