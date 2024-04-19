import React, { useState, useRef } from 'react';
import axios from 'axios';
import { URL } from "../App";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jkuatlogo from "../images/jkuatlogo.jpeg";
import { HiPhoto } from "react-icons/hi2";

function Logbook({ onNextForm }) {
    const [modelNumber, setModelNumber] = useState('');
    const [chasisNumber, setChasisNumber] = useState('');
    const [vehicleMake, setVehicleMake] = useState('');
    const [engineNumber, setEngineNumber] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [isOwnerDriver, setIsOwnerDriver] = useState("false");
    const [logbookImage, setLogbookImage] = useState('');
    const formRef = useRef(null);
    const [imageError, setImageError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleModelNumber = (event) => {
        const inputValue = event.target.value;
        setModelNumber(inputValue);
    }

    const handleChasisNumber = (event) => {
        const inputValue = event.target.value;
        setChasisNumber(inputValue);
    }

    const handleVehicleMake = (event) => {
        const inputValue = event.target.value;
        setVehicleMake(inputValue);
    }

    const handleEngineNumber = (event) => {
        const inputValue = event.target.value;
        setEngineNumber(inputValue);
    }

    const handleOwnerName = (event) => {
        const inputValue = event.target.value;
        setOwnerName(inputValue);
    }

    const handleIsOwnerDriver = (event) => {
        const inputValue = event.target.value;
        setIsOwnerDriver(inputValue);
    }

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (selectedFile && allowedImageTypes.includes(selectedFile.type)) {
            setImageError("");
            setLogbookImage(selectedFile);
        } else {
            setLogbookImage(null);
            setImageError("Please upload jpeg, png, or jpg image type");
        }
    }

    const submitLogBook = async (event) => {
        event.preventDefault()
        try {
            if (!modelNumber || !chasisNumber || !vehicleMake || !engineNumber || !ownerName || !isOwnerDriver || !logbookImage) {
                toast.warning("All fields are required!");
                return;
            }

            const USERID = localStorage.getItem("userId");
            const token = localStorage.getItem("token");
            setLoading(true);
            const formData = new FormData();
            formData.append("modelNumber", modelNumber);
            formData.append("chasisNumber", chasisNumber);
            formData.append("vehicleMake", vehicleMake);
            formData.append("engineNumber", engineNumber);
            formData.append("ownerName", ownerName);
            formData.append("isOwnerDriver", isOwnerDriver);
            formData.append("logbookImage", logbookImage);
            formData.append("userId", USERID);

            const response = await axios.post(`${URL}/api/users/logbook`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-access-token': token
                }
            });

            if (response.status === 201) {
                toast.success("Logbook submitted successfully");
                onNextForm(); // Navigate to the next form
            }
        } catch (error) {
            console.log(error);
            toast.error(`An error occurred: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submitLogBook} className="mt-16 mx-auto max-w-4xl p-3 items-center justify-center mb-10" style={{backgroundColor:"#F1FADA"}} ref={formRef}>
            <div className="text-center mb-8">
                <img src={jkuatlogo} alt="jkuat logo" className="h-16 mx-auto rounded-full" />
                <h1 className="text-3xl font-bold">Logbook</h1>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 justify-center items-center max-w-2xl mx-auto">
                {/* Chasis Number */}
                <div>
                    <label htmlFor="chasisNumber" className="grid text-sm font-medium leading-6 text-gray-900">Chasis Number</label>
                    <input type="text" name="chasisNumber" id="chasisNumber" value={chasisNumber} onChange={handleChasisNumber} className="p-2 mt-2 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Chasis Number" />
                </div>
                {/* Vehicle Make */}
                <div>
                    <label htmlFor="vehicleMake" className="grid text-sm font-medium leading-6 text-gray-900">Vehicle Make</label>
                    <input type="text" name="vehicleMake" id="vehicleMake" value={vehicleMake} onChange={handleVehicleMake} className="p-2 mt-2 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Vehicle Make" />
                </div>
                {/* Model Number */}
                <div>
                    <label htmlFor="modelNumber" className="grid text-sm font-medium leading-6 text-gray-900">Model Number</label>
                    <input type="text" name="modelNumber" id="modelNumber" value={modelNumber} onChange={handleModelNumber} className="p-2 mt-2 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Model Number" />
                </div>
                {/* Engine Number */}
                <div>
                    <label htmlFor="engineNumber" className="grid text-sm font-medium leading-6 text-gray-900">Engine Number</label>
                    <input type="text" name="engineNumber" id="engineNumber" value={engineNumber} onChange={handleEngineNumber} className="p-2 mt-2 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Engine Number" />
                </div>
                {/* Owner's Name */}
                <div>
                    <label htmlFor="ownerName" className="grid text-sm font-medium leading-6 text-gray-900">Owner's Name</label>
                    <input type="text" name="ownerName" id="ownerName" value={ownerName} onChange={handleOwnerName} className="p-2 mt-2 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Owner's Name" />
                </div>
                {/* Is owner the driver? */}
                <div>
                    <label htmlFor="isOwnerDriver" className="grid text-sm font-medium leading-18 text-gray-900">Is owner the driver?</label>
                    <select id="isOwnerDriver" name="isOwnerDriver" value={isOwnerDriver} onChange={handleIsOwnerDriver} className="p-2 mt-2 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
                {/* Logbook Photo */}
                <div>
                    <label htmlFor="logbookImage" className="grid text-sm font-medium leading-12 text-gray-900">Logbook Photo</label>
                    <div className="mt-2 flex items-center justify-center flex-col border border-dashed border-gray-400 rounded-lg py-8 px-6">
                        <label htmlFor="logbookImage" className="flex items-center justify-center rounded-md font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <HiPhoto className="h-8 w-8 mr-2" />
                            Click here to upload logbook
                            <input id="logbookImage" name="logbookImage" type="file" className="sr-only" onChange={handleFileChange} required />
                        </label>
                        <p className="mt-2 text-xs text-gray-600">PNG, JPG or JPEG only, up to 10MB</p>
                        {imageError && <p className="mt-2 text-sm text-red-500">{imageError}</p>}
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-center">
                <button type="submit" disabled={loading} className="w-full sm:w-auto bg-indigo-600 px-6 py-3 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {loading ? "Loading" : "Next"}
                </button>
            </div>
            <div className='m-10 text-center justify-center'>1 of 3</div>
            <ToastContainer />
        </form>
    );
}

export default Logbook;
