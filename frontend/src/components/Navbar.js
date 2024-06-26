import React, { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import prof from '../images/prof.jpeg';
import jkuatlogo from '../images/jkuatlogo.jpeg';
import { MdOutlineClose } from 'react-icons/md';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { GiHamburgerMenu } from 'react-icons/gi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { URL } from '../App';
import { useNavigate } from 'react-router-dom';


// Navigation links
const navigation = [
    { name: 'Home', href: '/', current: true },
    { name: 'My uploads', href: '/myuploads', current: false },
    { name: 'Contact', href: '/contact', current: false },
    { name: 'Book-Inspection', href: '/bookinspection', current: false },
];

// Utility function to concatenate classes conditionally
function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}


function Navbar() {
const navigate = useNavigate();

//logout function
async function handleLogout() {
    try {
        const response = await axios.post(`${URL}/api/users/logout`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            // Clear JWT token from local storage or cookie upon successful logout
            localStorage.removeItem('token');
            // Redirect to login page or any other route
            navigate('/login');
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
        <div className="fixed top-0 w-full z-50">
            <Disclosure as="nav" style={{ backgroundColor: '#54B435' }}>
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                            <div className="relative flex h-16 items-center justify-between">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-800 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">Open main menu</span>
                                        {open ? <MdOutlineClose className="block h-6 w-6" aria-hidden="true" /> : <GiHamburgerMenu className="block h-6 w-6" aria-hidden="true" />}
                                    </Disclosure.Button>
                                </div>
                                {/* company logo container */}
                                <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-start">
                                    <div className="flex items-center ml-12">
                                        <img className='h-8 w-8 rounded-full' src={jkuatlogo} alt='jkuat logo'></img>
                                    </div>
                                    <div className='hidden sm:ml-6 sm:block'>
                                        {/* navigation links container */}
                                        <div className="flex space-x-4">
                                            {
                                                navigation.map((item) => (<a
                                                    key={item.name}
                                                    href={item.href}
                                                    className={classNames(
                                                        // check if that item is current or not
                                                        item.current ? 'bg-gray-900 text-white ' : 'text-gray-300 hover:bg-gray-700 hover:text-white', ' rounded-md px-3 py-1.5 text-sm font-medium'
                                                    )}
                                                    aria-current={item.current ? 'page' : undefined}>
                                                    {item.name}
                                                </a>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                    <button
                                        type="button"
                                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                    >
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">View notifications</span>
                                        <IoMdNotificationsOutline className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                    <Menu as="div" className="relative ml-3">
                                        <div>
                                            <Menu.Button className="relative flex rounded-full bg-2E5A1C text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">Open user menu</span>
                                                <img className="h-8 w-8 rounded-full" src={prof} alt="profile thumb" />
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            href="/profile"
                                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                        >
                                                            Your Profile
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            href="/settings"
                                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                        >
                                                            Settings
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button onClick={handleLogout}
                                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                        >
                                                            Sign out
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                        </div>
                        <Disclosure.Panel className="sm:hidden">
                            <div className="space-y-1 px-2 pb-3 pt-2">
                                {navigation.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        className={classNames(
                                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'block rounded-md px-3 py-2 text-base font-medium'
                                        )}
                                        aria-current={item.current ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
            <ToastContainer />
        </div>
    );
}

export default Navbar;
