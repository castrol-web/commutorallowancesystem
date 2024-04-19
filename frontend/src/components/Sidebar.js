import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'react-tooltip/dist/react-tooltip.css'
import { RxDashboard } from "react-icons/rx";
import { IoIosPeople } from "react-icons/io";
import { FcInspection } from "react-icons/fc";
import { IoIosLogOut } from "react-icons/io";
import jkuatlogo from "../images/jkuatlogo.jpeg";
import { FaPhone } from "react-icons/fa";
import { URL } from '../App';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const NavigationLinks = [
    {
        title: 'Dashboard',
        links: [
            {
                name: 'dashboard',
                icon: <RxDashboard />,
            },
        ],
    },
    {
        title: 'Pages',
        links: [
            {
                name: 'Employees',
                icon: <IoIosPeople />,
            },
            {
                name: 'Inspections',
                icon: <FcInspection />
            }
            ,
            {
                name: 'Contacts',
                icon: <FaPhone />
            }
        ],
    }
]

function Sidebar({ isSidebarOpen }) {
    const activeLink = 'flex items-center gap-5 pl-4 pt-2.5 rounded-lg m-2';
    const normalLink = 'flex items-center gap-5 pl-4 pt-2.5 rounded-lg hover:bg-light-gray m-2';


    const navigate = useNavigate();

    //logout function 
     async function handleLogout() {
        try {
            const response = await axios.post(`${URL}/api/admin/logout`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                // Clear JWT token from local storage or cookie upon successful logout
                localStorage.removeItem('token');
                // Redirect to login page or any other route
                navigate('/signin');
            }
    
        } catch (error) {
            if (error.response && error.response.status === 500) {
                toast.error('Server error. Please try again later.');
            } else {
                toast.error('An unexpected error occurred. Please try again later!');
            }
        }
    }

    return (
        <>
            {isSidebarOpen && (
                <div className='sidebar w-72 items-center justify-center bg-gray-800'>
                    <div className='h-screen md:overflow-hidden overflow-auto pb-10'>
                        <div className='h-16 flex justify-between items-center' style={{ backgroundColor: '#54B435' }}>
                            <Link to='/dashboard' className='flex justify-between items-center gap-3 mt-4 ml-3 
                            text-xl font-extrabold tracking-tight text-slate-900'>
                                <img src={jkuatlogo} className='h-8 rounded-full' alt="Logo"></img>
                                <h1>JCOMMUTOR</h1>
                            </Link>
                        </div>
                        <div className='mt-10 items-center'>
                            {
                                NavigationLinks.map((item) => {
                                    return <div key={item.title} className='items-center justify-center'>
                                        <p className='text-gray-400 mt-4 uppercase pl-4'>
                                            {item.title}
                                        </p>
                                        {item.links.map((link) => {
                                            return <Link to={`/${link.name}`}
                                                key={link.name}
                                                className={`${link.name === 'Dashboard' ? activeLink : normalLink}`}
                                            >
                                                <div className='flex gap-5 items-center pl-4 pr-4 pt-3 pb-2.5 rounded-lg hover:bg-slate-300 m-2'>
                                                    {link.icon}
                                                    <span className='capitalize'>{link.name}</span>
                                                </div>
                                            </Link>
                                        })}
                                    </div>
                                })
                            }
                        </div>
                        <hr></hr>
                        <div className='mt-10 items-center mx-auto'>
                            <button type='button' onClick={handleLogout} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">LOGOUT</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Sidebar;
