import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { URL } from '../../App';
import { FadeLoader } from 'react-spinners';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

function Employees() {
    const [employees, setEmployees] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Getting all employees from the database 
    async function getEmployees() {
        try {
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("role");
            const admin = role === "admin";
            //checking if there is a token in place and if the user is an admin
            if(!token || !admin){
                navigate("/signin");
            }
            setLoading(true);
            const response = await axios.get(`${URL}/api/admin/employees`, {
                method: "GET",
                headers: {
                    "x-access-token": token
                }
            });
            if (response.status === 200) {
                setEmployees(response.data.employees);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getEmployees();
    }, []);



    if (loading) {
        return <div className="text-center mt-96">
            <FadeLoader color={'#36d7b7'} css={override} size={100} className='mx-auto' />
            <p>loading .....</p>
        </div>
    }

    return (
        <div className='mt-20'>
            <div className='flex justify-between items-center mb-10 py-10'>
                <div className='flex justify-between gap-6'>
                    <input placeholder='search employee by name' className="p-2 mt-2 block w-full h-10 border-gray-800 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></input>
                    <button type="button" className="w-full sm:w-auto bg-blue-600 px-6 py-2 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Search
                    </button>
                </div>
                <button type="button" className="w-full sm:w-auto bg-blue-600 px-6 py-2 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    + Add Employee
                </button>
            </div>
            <table className='min-w-full'>
                <thead>
                    <tr>
                        <th className='px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>#</th>
                        <th className='px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>First Name</th>
                        <th className='px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Last Name</th>
                        <th className='px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Email</th>
                        <th className='px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Phone</th>
                        <th className='px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Department</th>
                        <th className='px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Marital Status</th>
                        <th className='px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Verified</th>
                    </tr>
                </thead>
                <tbody>
                    {employees && employees.map((employee, index) => (
                        <tr key={index}>
                            <td className='px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900'>{index + 1}</td>
                            <td className='px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500'>{employee.firstname}</td>
                            <td className='px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500'>{employee.lastname}</td>
                            <td className='px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500'>{employee.email}</td>
                            <td className='px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500'>{employee.phone}</td>
                            <td className='px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500'>{employee.department}</td>
                            <td className='px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500'>{employee.MaritalStatus}</td>
                            <td className='px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500'>{employee.verified ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// CSS override for the loading spinner
const override = css`
  display: block;
  margin: 0 auto;
`;

export default Employees;
