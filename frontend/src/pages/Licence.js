import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URL } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jkuatlogo from "../images/jkuatlogo.jpeg";
import { HiPhoto } from "react-icons/hi2";

function Licence() {
    //licence submission
    const [licenceValid, setLicenceValid] = useState('');
    const [licenceImagePath, setLicenceImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null);
    const [licenceImageError, setlicenceImageError] = useState('');
    const navigate = useNavigate();

    function handleChangelicence(e) {
        const inputChange = e.target.value;
        setLicenceValid(inputChange);
    }

    function handlelicenceImage(event) {
        const selectedFile = event.target.files[0];
        const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (selectedFile && allowedImageTypes.includes(selectedFile.type)) {
            setlicenceImageError("")
            setLicenceImage(selectedFile);
        } else {
            setLicenceImage(null);
            setlicenceImageError("Please upload,jpeg|png|jpg image type");
        }
    }
    console.log(licenceImagePath);
    const SubmitLicence = async (event) => {
        event.preventDefault();
        try {
            const userId = localStorage.getItem("userId");
            const formdata = new FormData();
            formdata.append("licenceValid", licenceValid);
            formdata.append("licenceImagePath", licenceImagePath);
            formdata.append("userId", userId);
            const token = localStorage.getItem("token");
            setLoading(true)
            const response = await axios.post(`${URL}/api/users/licence`, formdata,
                {
                    headers: {
                        'x-access-token': token
                    }
                });
            if (response.status === 201) {
                toast.success("submitted successfully");
                navigate("/bookinspection");
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }
    return (
        <form method='post' encType="multipart/form-data" onSubmit={SubmitLicence} style={{backgroundColor:"#F1FADA"}} className='mt-20'>
            <div className="text-center mb-8">
                <img src={jkuatlogo} alt="jkuat logo" className="h-16 mx-auto rounded-full" />
                <h1 className="text-3xl font-bold">DRIVER'S LICENCE</h1>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 justify-center items-center max-w-2xl mx-auto" ref={formRef}>
                <div>
                    <div className='input_fields'>
                        <label htmlFor='licenceValid'>valid Until</label>
                        <input id='licenceValid' type='date' placeholder="valid until"  className="p-2 mt-2 block w-full h-10 border-gray rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" name='licenceValid' value={licenceValid} onChange={handleChangelicence} />
                    </div>

                    <div>
                        <label htmlFor="licenceImagePath" className="grid text-sm font-medium leading-12 text-gray-900">Licence Image</label>
                        <div className="mt-2 flex items-center justify-center flex-col border border-dashed border-gray-400 rounded-lg py-8 px-6">
                            <label htmlFor="licenceImagePath" className="flex items-center justify-center rounded-md font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <HiPhoto className="h-8 w-8 mr-2" />
                                Click here to upload Licence
                                <input id="licenceImagePath" name="licenceImagePath" type="file" className="sr-only" onChange={handlelicenceImage} required />
                            </label>
                            <p className="mt-2 text-xs text-gray-600">PNG, JPG or JPEG only, up to 10MB</p>
                            {licenceImageError && <p className="mt-2 text-sm text-red-500">{licenceImageError}</p>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-center">
                <button type="submit" disabled={loading} className="w-full sm:w-auto bg-indigo-600 px-6 py-3 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {loading ? "Loading" : "Finish"}
                </button>
            </div>
            <div className='m-10 text-center justify-center'>3 of 3</div>
            <ToastContainer />
        </form>


    )
}

export default Licence