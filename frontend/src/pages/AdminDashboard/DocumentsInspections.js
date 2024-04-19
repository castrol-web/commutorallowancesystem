import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { URL } from '../../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function DocumentsInspections() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { logbook, id, logbookUrl, licence, licenceUrl, insurance, insuranceUrl } = location.state;
    const navigate = useNavigate();

    //approve document function
    async function ApproveDocument(event) {
        event.preventDefault();
        const token = localStorage.getItem("token");
        try {
            setLoading(true);
            await axios.put(`${URL}/api/admin/confirm-documents/${id}`, {
                method: "PUT",
                headers: {
                    "x-access-token": token
                }
            }).then(async (response) => {
                if (response.status === 200) {
                    toast.success(response.data.message);
                    navigate("/Inspections");
                }

            });

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

    //rejected 
    async function RejectDocument(event) {
        event.preventDefault();
        const token = localStorage.getItem("token");
        try {
            await axios.put(`${URL}/api/admin/reject-documents/${id}`, {
                method: "PUT",
                headers: {
                    "x-access-token": token
                }
            }).then(async (response) => {
                if (response.status === 200) {
                    toast.success(response.data.message);
                    navigate("/Inspections");
                }

            });

        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error(error.response.data.message);
            } else if (error.response && error.response.status === 500) {
                toast.error('Server error. Please try again later.');
            } else {
                toast.error('An unexpected error occurred. Please try again later!');
            }
        }
    }
    return (
        <div className='mt-20'>
            <div className='text-center items-center justify-center text-4xl'>
                <h1>Documents Inspections</h1>
            </div>
            <div className="grid-cols-1 sm:grid md:grid-cols-3 mt-20 mb-24 items-center justify-center">
                {logbook ? (
                    <div key={logbook._id} className="mx-10 mt-6 flex flex-col rounded-lg  text-surface shadow-secondary-1 sm:shrink-0 sm:grow sm:basis-0">
                        <div className="p-6 text-center items-center">
                            <h5 className="mb-2 text-xl font-medium leading-tight">lOGBOOK</h5>
                            <div className='justify-center items-center'>
                                <img
                                    src={logbookUrl}
                                    alt="logbook"></img>
                            </div>
                            <div className="mb-2 text-base gap-10 flex text-center justify-center">
                                <p><small>Logbook Id:</small></p>
                                <p><small>{logbook._id}</small></p>
                            </div>
                            <div className="mb-2 text-base gap-10 flex text-center justify-center">
                                <p><small>Owner's Name:</small></p>
                                <p><small>{logbook.ownerName}</small></p>
                            </div>
                            <div className="mb-2 text-base gap-10 flex text-center justify-center">
                                <p><small>Model Number:</small></p>
                                <p><small>{logbook.modelNumber}</small></p>
                            </div>
                            <div className="mb-2 text-base gap-10 flex text-center justify-center">
                                <p><small>Chasis Number:</small></p>
                                <p><small>{logbook.chasisNumber}</small></p>
                            </div>
                            <div className="mb-2 text-base gap-10 flex text-center justify-center">
                                <p><small>Vehicle Make:</small></p>
                                <p><small>{logbook.vehicleMake}</small></p>
                            </div>
                            <div className="mb-2 text-base gap-10 flex text-center justify-center">
                                <p><small>Engine Number:</small></p>
                                <p><small>{logbook.engineNumber}</small></p>
                            </div>
                            <div className="mb-2 text-base gap-10 flex text-center justify-center">
                                <p><small>Status</small></p>
                                <p className='text-gray-300'><small>{logbook.status}</small></p>
                            </div>
                        </div>
                        <div className=" border-neutral-100 px-6 text-center dark:border-white/10 dark:text-neutral-300">
                            <small>uploaded at: </small>
                        </div>
                    </div>
                ) : (
                    <div>No logbook data available.</div>
                )}


                {insurance ? (
                    <div key={insurance._id} className="mx-10 mt-6 flex flex-col rounded-lg  text-surface shadow-secondary-1 sm:shrink-0 sm:grow sm:basis-0">
                        <div className="p-6 text-center items-center">
                            <h5 className="mb-2 text-xl font-medium leading-tight">INSURANCE</h5>
                            <div>
                                <img
                                    src={insuranceUrl}
                                    alt="logbook"></img>
                            </div>
                            <div className="mb-2 text-base gap-10 flex text-center justify-center">
                                <p><small>Logbook Id:</small></p>
                                <p><small>{insurance._id}</small></p>
                            </div>
                            <div className="mb-2 text-base gap-10 flex text-center justify-center">
                                <p><small>INSURANCE PROVIDER:</small></p>
                                <p><small>{insurance.insuranceProvider}</small></p>
                            </div>
                            <div className="mb-2 text-base gap-10 flex text-center justify-center">
                                <p><small>POLICY NUMBER:</small></p>
                                <p><small>{insurance.insurancePolicyNumber}</small></p>
                            </div>
                            <div className="mb-2 text-base gap-10 flex text-center justify-center">
                                <p><small>TYPE:</small></p>
                                <p><small>{insurance.insuranceType}</small></p>
                            </div>
                            <div className="mb-2 text-base gap-10 flex text-center justify-center">
                                <p><small>Status</small></p>
                                <p className='text-gray-300'><small>{insurance.status}</small></p>
                            </div>
                        </div>
                        <div className=" border-neutral-100 px-6 text-center dark:border-white/10 dark:text-neutral-300">
                            <small>uploaded at: {insurance.created_at} </small>
                        </div>
                    </div>
                ) : (
                    <div>No licence data available.</div>
                )}


                {licence ? (
                    <div key={licence._id} className="mx-10 mt-6 flex flex-col rounded-lg  text-surface shadow-secondary-1 sm:shrink-0 sm:grow sm:basis-0">
                        <div className="p-6 text-center items-center">
                            <h5 className="mb-2 text-xl font-medium leading-tight">LICENCE</h5>
                            <div >
                                <img
                                    src={licenceUrl}
                                    alt="licence"></img>
                            </div>
                            <div className="mb-2 text-base gap-10 flex text-center justify-center">
                                <p><small>Licence Id:</small></p>
                                <p><small>{licence._id}</small></p>
                            </div>
                            <div className="mb-2 text-base gap-10 flex text-center justify-center">
                                <p><small>Valid Until:</small></p>
                                <p><small>{licence.licenceValid}</small></p>
                            </div>

                            <div className="mb-2 text-base gap-10 flex text-center justify-center">
                                <p><small>Status</small></p>
                                <p className='text-gray-300'><small>{licence.status}</small></p>
                            </div>
                        </div>
                        <div className=" border-neutral-100 px-6 text-center dark:border-white/10 dark:text-neutral-300">
                            <small>uploaded at:{licence.created_at} </small>
                        </div>
                    </div>
                ) : (
                    <div>No licence data available.</div>
                )}

            </div>
            {/* approve or reject buttons */}
            <div className='flex justify-between mx-96 mb-10'>
                <button type="submit" onClick={RejectDocument} disabled={loading} className="w-full sm:w-auto bg-red-800 px-6 py-3 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {loading ? "Loading" : "Reject"}
                </button>

                <button type="submit" disabled={loading} onClick={ApproveDocument} className="w-full sm:w-auto bg-emerald-500 px-6 py-3 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {loading ? "Loading" : "Approve"}
                </button>
            </div>
            <ToastContainer />
        </div>
    )
}

export default DocumentsInspections