import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { URL } from '../../App';
import { MdViewList } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function Inspections() {
  const [employees, setEmployee] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getInspections() {
      try {
        const token = localStorage.getItem("token");
        setLoading(true);
        const response = await axios.get(`${URL}/api/admin/Inspections`, {
          method: "GET",
          headers: {
            "x-access-token": token
          }
        });
        const pendingInspections = response.data.pendingInspections;

        //getting employee details from inspection
        const extractedEmployees = pendingInspections.map((inspections) => inspections.employee);
        setEmployee(extractedEmployees);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getInspections()
  }, []);

  async function viewDocuments(id) {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${URL}/api/admin/showdocument/${id}`,{
        method:"GET",
        headers:{
          "x-access-token":token
        }
      });
      //fetching the documents from the response

      const logbookUrl = response.data.logbkUrl;
      const logbook = response.data.logbook;
      //licence
      const licence = response.data.licence;
      const licenceUrl = response.data.licenceUrl;

      //insurance
      const insurance = response.data.insurance;
      const insuranceUrl = response.data.insuranceUrl;
      navigate("/inspection-documents", { state: { id, logbook, licence, licenceUrl, logbookUrl, insurance, insuranceUrl } });
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return <div className='mt-20 items-center justify-center'>
      <p>loading ...</p>
    </div>
  }

  return (
    <div>
      <table className='min-w-full mt-20'>
        <thead>
          <tr>
            <th className='px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>#</th>
            <th className='px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>First Name</th>
            <th className='px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Last Name</th>
            <th className='px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Email</th>
            <th className='px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Phone</th>
            <th className='px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Inspect</th>
          </tr>
        </thead>
        <tbody>
          {employees && employees.map((employee, index) => (
            <tr key={employee._id}>
              <td className='px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900'>{index + 1}</td>
              <td className='px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500'>{employee.firstname}</td>
              <td className='px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500'>{employee.lastname}</td>
              <td className='px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500'>{employee.email}</td>
              <td className='px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500'>{employee.phone}</td>
              <td className='px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500'><MdViewList onClick={() => viewDocuments(employee._id)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Inspections
