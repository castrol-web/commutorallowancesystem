import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { URL } from '../App';
import { useNavigate } from 'react-router-dom';
import "./uploads.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { css } from '@emotion/react';
import { FadeLoader } from 'react-spinners';



function Myuploads() {
  const navigate = useNavigate();
  const [logbookEntries, setLogbookEntries] = useState([]);
  const [licenceEntries, setLicenceEntries] = useState([]);
  const [insuranceEntries, setInsuranceEntries] = useState([]);
  const [logbookUrl, setLogbookUrl] = useState([]);
  const [insuranceUrl, setInsuranceUrl] = useState([]);
  const [licenceUrl, setLicenceUrl] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  async function getUploads() {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const userId = decoded._id;
      setLoading(true);
      const response = await axios.get(`${URL}/api/users/myuploads/${userId}`, {
        headers: {
          "x-access-token": token
        }
      });

      setLogbookEntries(response.data.logbook);
      setLicenceEntries(response.data.licence);
      setInsuranceEntries(response.data.insurance);
      //logbook url
      setLogbookUrl(response.data.logbookUrl);
      //insurance 
      setInsuranceUrl(response.data.insuranceUrl);
      //licence url
      setLicenceUrl(response.data.licenceUrl);


    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error:", error);
      if (error.response && error.response.status === 404) {
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



  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = jwtDecode(token);
      if (!user) {
        navigate("/login");
      } else {
        getUploads();
      }
    }
  }, [navigate]);

  if (loading) {
    return <div className="text-center mt-96">
      <FadeLoader color={'#36d7b7'} css={override} size={100} className='mx-auto' />
      <p>loading please wait...</p>
    </div>
  }

  if (error) {
    return <p>{error}</p>;
  }

  //navigate to logbook component
  function handleLogbookNavigation() {
    navigate("/logbook");
  }

  function handleInsuranceNavigation() {
    navigate("/insurance");
  }

  function handleLicenceNavigation() {
    navigate("licence");
  }

  return (
    <>
      <div className='text-center mt-24'>
        <h1>Your Uploaded Documents Will appear below</h1>
        <p>If you don't see any of the document click on the upload buttons to upload first</p>
      </div>
      <div className="grid-cols-1 sm:grid md:grid-cols-3 mt-20 mb-24">
        {logbookEntries ? <div className="mx-10 mt-6 flex flex-col rounded-lg  text-surface shadow-secondary-1 sm:shrink-0 sm:grow sm:basis-0">
          <img className="rounded-t-lg"
            src={logbookUrl}
            alt="logbook" />
          <div className="p-6 text-center items-center">
            <h5 className="mb-2 text-xl font-medium leading-tight">Logbook</h5>
            <div className="mb-2 text-base gap-10 flex text-center justify-center">
              <p><small>Logbook Id:</small></p>
              <p><small>{logbookEntries._id}</small></p>
            </div>
            <div className="mb-2 text-base gap-10 flex text-center justify-center">
              <p><small>Owner's Name:</small></p>
              <p><small>{logbookEntries.ownerName}</small></p>
            </div>
            <div className="mb-2 text-base gap-10 flex text-center justify-center">
              <p><small>Model Number:</small></p>
              <p><small>{logbookEntries.modelNumber}</small></p>
            </div>
            <div className="mb-2 text-base gap-10 flex text-center justify-center">
              <p><small>Chasis Number:</small></p>
              <p><small>{logbookEntries.chasisNumber}</small></p>
            </div>
            <div className="mb-2 text-base gap-10 flex text-center justify-center">
              <p><small>Vehicle Make:</small></p>
              <p><small>{logbookEntries.vehicleMake}</small></p>
            </div>
            <div className="mb-2 text-base gap-10 flex text-center justify-center">
              <p><small>Engine Number:</small></p>
              <p><small>{logbookEntries.engineNumber}</small></p>
            </div>
            <div className="mb-2 text-base gap-10 flex text-center justify-center">
              <p><small>Status</small></p>
              <p className='text-gray-300'><small>{logbookEntries.status}</small></p>
            </div>
          </div>
          <div className=" border-neutral-100 px-6 text-center dark:border-white/10 dark:text-neutral-300">
            <small>uploaded at: {logbookEntries.created_at}</small>
          </div>
        </div> :
          <div className='text-center items-center justify-center mt-10'>
            <div>
              <h1>Logbook not yet uploaded,upload to Continue</h1>
            </div>
            <div className="mt-6 flex justify-center">
              <button type="button" disabled={loading} onClick={handleLogbookNavigation} className="w-full sm:w-auto bg-indigo-600 px-6 py-3 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                UPLOAD LOGBOOK
              </button>
            </div>
          </div>
        }
        {insuranceEntries ? <div className="mx-10 mt-6 flex flex-col rounded-lg  text-surface shadow-secondary-1 sm:shrink-0 sm:grow sm:basis-0">
          <img className="rounded-t-lg"
            src={insuranceUrl}
            alt="insurance" />
          <div className="p-6 text-center items-center">
            <h5 className="mb-2 text-xl font-medium leading-tight">Insurance</h5>
            <div className="mb-2 text-base gap-10 flex text-center justify-center">
              <p><small>{insuranceEntries._id}</small></p>
            </div>
            <div className="mb-2 text-base gap-10 flex text-center justify-center">
              <p><small>Insurance Provider:</small></p>
              <p><small>{insuranceEntries.insuranceProvider}</small></p>
            </div>
            <div className="mb-2 text-base gap-10 flex text-center justify-center">
              <p><small>Valid Until:</small></p>
              <p><small>{insuranceEntries.validUntil}</small></p>
            </div>
            <div className="mb-2 text-base gap-10 flex text-center justify-center">
              <p><small>Policy Number:</small></p>
              <p><small>{insuranceEntries.insurancePolicyNumber}</small></p>
            </div>
            <div className="mb-2 text-base gap-10 flex text-center justify-center">
              <p><small>Insurance Type:</small></p>
              <p><small>{insuranceEntries.insuranceType}</small></p>
            </div>
            <div className="mb-2 text-base gap-10 flex text-center justify-center">
              <p><small>Status:</small></p>
              <p className='text-gray-300'><small>{insuranceEntries.status}</small></p>
            </div>
          </div>
          <div className=" border-neutral-100 px-6 text-center dark:border-white/10 dark:text-neutral-300">
            <small>uploaded at: {insuranceEntries.created_at}</small>
          </div>
        </div>
          :
          <div className='text-center items-center justify-center mt-10'>
            <div>
              <h1>Insurance not yet uploaded,please upload to Continue</h1>
            </div>
            <div className="mt-6 flex justify-center">
              <button type="button" disabled={loading} onClick={handleInsuranceNavigation} className="w-full sm:w-auto bg-indigo-600 px-6 py-3 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                UPLOAD INSURANCE
              </button>
            </div>
          </div>}

        {licenceEntries ? <div className="mx-10 mt-6 flex flex-col rounded-lg  text-surface shadow-secondary-1 sm:shrink-0 sm:grow sm:basis-0">
          <img className="rounded-t-lg"
            src={licenceUrl}
            alt="licence" />
          <div className="p-6 text-center items-center">
            <h5 className="mb-2 text-xl font-medium leading-tight">Licence</h5>
            <div className="mb-2 text-base gap-10 flex text-center justify-center">
              <p><small>{licenceEntries._id}</small></p>
            </div>
            <div className="mb-2 text-base gap-10 flex text-center justify-center">
              <p><small>Valid Until:</small></p>
              <p><small>{licenceEntries.licenceValid}</small></p>
            </div>
            <div className="mb-2 text-base gap-10 flex text-center justify-center">
              <p><small>Status</small></p>
              <p className='text-gray-300'><small>{licenceEntries.status}</small></p>
            </div>
          </div>
          <div className=" border-neutral-100 px-6 text-center dark:border-white/10 dark:text-neutral-300">
            <small>uploaded at: {licenceEntries.created_at}</small>
          </div>
        </div> :
          <div className='text-center items-center justify-center mt-10'>
            <div>
              <h1>Licence not yet uploaded,please upload to Continue</h1>
            </div>
            <div className="mt-6 flex justify-center">
              <button type="button" disabled={loading} onClick={handleLicenceNavigation} className="w-full sm:w-auto bg-indigo-600 px-6 py-3 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Upload Licence
              </button>
            </div>
          </div>
        }
      </div>

    </>
  );
}

// CSS override for the loading spinner
const override = css`
  display: block;
  margin: 0 auto;
`;

export default Myuploads;
