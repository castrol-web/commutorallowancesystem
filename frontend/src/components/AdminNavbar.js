import React from 'react';
import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
import { CiChat2 } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";


const AdminNavbar = ({ toggleSidebar }) => {
  return (
    <nav style={{ backgroundColor: '#54B435' }} className='fixed w-full'>
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className='flex justify-between items-center'>
              <GiHamburgerMenu onClick={toggleSidebar} className='text-white'/>
          </div>

          <div className=" md:block">
            <div className="flex items-center">
              <Link to="/profile" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                <FaUser className="h-6 w-6" />
              </Link>
              <Link to="/chats" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                <CiChat2 className="h-6 w-6" />
              </Link>
              <Link to="/notifications" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                <IoIosNotificationsOutline className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
