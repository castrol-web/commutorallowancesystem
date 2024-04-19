import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { css } from '@emotion/react';
import { FadeLoader } from 'react-spinners';


function Dashboard() {
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);


    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/signin");
        } else {
            try {
                setLoading(true);
                const decoded = jwtDecode(token);
                setUserId(decoded);
            } catch (error) {
                console.error("Error decoding token:", error);
                navigate("/signin");
            } finally {
                setLoading(false);
            }
        }
    })

    if (loading) {
        return <div className="text-center mt-96">
            <FadeLoader color={'#36d7b7'} css={override} size={100} className='mx-auto' />
            <p>loading please wait...</p>
        </div>
    }

    return (
        userId && (
            <>
                <div className="container mx-auto mt-16">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-4">Dashboard</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Example cards or widgets */}
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Users</h2>
                            <p className="text-gray-600">100</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Contacts</h2>
                            <p className="text-gray-600">50</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Inspections</h2>
                            <p className="text-gray-600">200</p>
                        </div>

                    </div>
                </div>

            </>
        )
    )
}

// CSS override for the loading spinner
const override = css`
  display: block;
  margin: 0 auto;
`;

export default Dashboard