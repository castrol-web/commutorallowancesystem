import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import axios from 'axios';
import { URL } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jkuatlogo from "../images/jkuatlogo.jpeg";

function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            //decode token
            const decoded = jwtDecode(token);
            const id = decoded._id;
            const response = await axios.post(`${URL}/api/users/contact-us/${id}`, formData, {
                method: "POST",
                headers: {
                    "x-access-token": token,
                    'Content-Type': 'application/json',
                }
            })
            console.log(response);
            if (response.status === 201) {
                toast.success(response.data.message);
                // Clear form fields after submission
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });

            }

        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message);
            }if (error.response && error.response.status === 404) {
                toast.error(error.response.data.message);
            }
             else if (error.response && error.response.status === 500) {
                toast.error('Server error. Please try again later.');
            } else {
                toast.error('An unexpected error occurred. Please try again later!');
            }
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="container mx-auto px-4 py-8 mt-10">
            <form onSubmit={handleSubmit} method='post' action='api/contact-us' className="max-w-lg mx-auto p-10" style={{ backgroundColor: "#F1FADA" }}>
                <div className="text-center mb-8">
                    <img src={jkuatlogo} alt="jkuat logo" className="h-16 mx-auto rounded-full" />
                    <h1 className="text-3xl font-bold">Contact Us</h1>
                </div>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" placeholder="Your Name" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" placeholder="Your Email" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="subject" className="block text-gray-700 font-semibold mb-2">Subject</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" placeholder="Subject" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" rows="6" placeholder="Your Message" required />
                </div>
                <div className="text-center">
                    <button type="submit" disabled={loading} className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">{loading ? "loading..." : "Send Message"}</button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}

export default ContactPage;
