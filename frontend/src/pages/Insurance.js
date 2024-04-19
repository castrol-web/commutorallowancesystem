import React, { useState } from 'react';
import axios from 'axios';
import { URL } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HiPhoto } from "react-icons/hi2";
import jkuatlogo from "../images/jkuatlogo.jpeg";

function Insurance({ onNextForm }) {
    //states for user input management
    const [validUntil, setValidUntil] = useState("");
    const [insuranceProvider, setInsuranceProvider] = useState("");
    const [insurancePolicyNumber, setInsurancePolicyNumber] = useState("");
    const [insuranceType, setInsuranceType] = useState("");
    const [insuranceImage, setInsuranceImage] = useState(null);
    const [profileError, setProfileError] = useState("");
    const [errsms, setErrSms] = useState('');
    const [loading, setLoading] = useState(false);

    //functions for all the events 
    function handleChangeValid(event) {
        const inputValue = event.target.value;
        setValidUntil(inputValue);
    }

    function handleChangeProvider(event) {
        const inputValue = event.target.value;
        setInsuranceProvider(inputValue);
    }

    function handleChangePolicy(event) {
        const inputValue = event.target.value;
        setInsurancePolicyNumber(inputValue);
    }


    function handleChangeInsuranceType(event) {
        const inputValue = event.target.value;
        setInsuranceType(inputValue);
    }

    function handleInsuranceImage(event) {
        const SelectedFile = event.target.files[0];
        const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (SelectedFile && allowedImageTypes.includes(SelectedFile.type)) {
            setProfileError("")
            setInsuranceImage(SelectedFile);
        } else {
            setProfileError("You must upload jpeg|png|jpg image")
            setInsuranceImage(null);
        }
    }

    //form submission function
    const submitInsurance = async function (event) {
        event.preventDefault()
        if (!validUntil || !insuranceProvider || !insurancePolicyNumber || !insuranceType) {
            setErrSms("All field are required");
        }
        const userId = localStorage.getItem("userId");
        const formdata = new FormData();
        formdata.append("validUntil", validUntil);
        formdata.append("insuranceProvider", insuranceProvider);
        formdata.append("insurancePolicyNumber", insurancePolicyNumber);
        formdata.append("insuranceType", insuranceType);
        formdata.append("insuranceImagePath", insuranceImage);
        formdata.append("userId", userId);
        try {
            setLoading(true);
            //getting the token from the local storage
            const token = localStorage.getItem("token");
            const response = await axios.post(`${URL}/api/users/insurance`, formdata,
                {
                    headers: {
                        'x-access-token': token
                    }
                });
            if (response.status === 201) {
                toast.success("submitted successfully");
                onNextForm(); // Navigate to the next form
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form action='api/insurance' method='post' style={{backgroundColor:"#F1FADA"}} className="mx-auto max-w-4xl p-3 items-center justify-center" encType="multipart/form-data" onSubmit={submitInsurance}>
            {/* jkuat logo */}
            <div className="text-center mb-8">
                <img src={jkuatlogo} alt="jkuat logo" className="h-16 mx-auto rounded-full" />
                <h1 className="text-3xl font-bold">Insurance</h1>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 justify-center items-center max-w-2xl mx-auto">
                <div>
                    <div className='mt-5'>
                        <label htmlFor="validUntil" className="grid text-sm font-medium leading-6 text-gray-900">valid Until</label>
                        <input id='validUntil' type='date' name="validUntil" value={validUntil} onChange={handleChangeValid} className="p-2 mt-2 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Valid until"></input>
                    </div>
                    <div className='mt-5'>
                        <label htmlFor="insuranceProvider" className="grid text-sm font-medium leading-6 text-gray-900">Insurance provider</label>
                        <input id='insuranceProvider' type='text' name="insuranceProvider" 
                        value={insuranceProvider} 
                        onChange={handleChangeProvider} 
                        className="p-2 mt-2 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                        placeholder='Insurance Provider'></input>
                    </div>
                
                    <div className='mt-5'>
                        <label htmlFor="policy_number" className="grid text-sm font-medium leading-6 text-gray-900">Policy Number</label>
                        <input id='policy_number' type='text' name="insurancePolicyNumber" 
                        value={insurancePolicyNumber}
                        onChange={handleChangePolicy} 
                        className="p-2 mt-2 block w-full h-10 border-gray rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                        placeholder='policy number'></input>
                    </div>

                    <div className='mt-5'>
                        <label htmlFor="insuranceType" className="grid text-sm font-medium leading-6 text-gray-900">Type of insurance</label>
                        <input id='insuranceType' type='text' name="insuranceType" 
                        value={insuranceType} 
                        onChange={handleChangeInsuranceType} 
                        className="p-2 mt-2 block w-full h-10 border-gray rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                        placeholder='Insurance type'></input>
                    </div>
            

                    <div className='mt-5'>
                        <label htmlFor="insuranceImage" className="grid text-sm font-medium leading-12 text-gray-900">Upload Insurance Image</label>
                        <div className="p-2 mt-2 flex items-center justify-center flex-col border border-dashed border-gray-400 rounded-lg py-8 px-6">
                            <label htmlFor="insuranceImage" className="flex items-center justify-center rounded-md font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <HiPhoto className="h-8 w-8 mr-2" />
                                Click here to upload Insurance
                                <input id="insuranceImage" name="insuranceImagePath" type="file" className="sr-only" onChange={handleInsuranceImage} required />
                            </label>
                            <p className="mt-2 text-xs text-gray-600">PNG, JPG or JPEG only, up to 10MB</p>
                            {profileError && <p className="mt-2 text-sm text-red-500">{profileError}</p>}
                        </div>
                    </div>
                    {errsms && <p className="mt-2 text-sm text-red-500">{errsms}</p>}
                </div>
            </div>
            <div className="mt-6 flex justify-center">
                <button type="submit" disabled={loading} className="w-full sm:w-auto bg-indigo-600 px-6 py-3 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {loading ? "Loading" : "Next"}
                </button>
            </div>
            <div className='m-10 text-center justify-center'>2 of 3</div>
            <ToastContainer />
        </form>


    )
}

export default Insurance