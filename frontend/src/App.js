import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Registration from "./pages/Registration.js";
import Login from "./pages/Login.js";
import Mainpage from "./pages/Mainpage.js";
import Navbar from "./components/Navbar.js";
import EmailVerify from "./components/EmailVerify.js";
import Myuploads from "./components/Myuploads.js";
import Footer from "./components/Footer.js";
import BookInspection from "./pages/BookInspection.js";
import ContactPage from "./pages/ContactPage.js";
import Logbook from "./pages/Logbook.js";
import Insurance from "./pages/Insurance.js";
import Licence from "./pages/Licence.js";
import Dashboard from "./pages/AdminDashboard/Dashboard.js";
import Sidebar from "./components/Sidebar.js";
import AdminNavbar from "./components/AdminNavbar.js";
import Employees from "./pages/AdminDashboard/Employees.js";
import Inspections from "./pages/AdminDashboard/Inspections.js";
import Contacts from "./pages/AdminDashboard/Contacts.js";
import DocumentsInspections from "./pages/AdminDashboard/DocumentsInspections.js";
// import Signup from "./pages/AdminDashboard/Signup.js";
import Signin from "./pages/AdminDashboard/Signin.js";

// Backend URL
export const URL = process.env.REACT_APP_SERVER_URL;

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  //get user role
  const getUserRole = () => {
    return localStorage.getItem("role"); // Return the role
  }

  useEffect(() => {
    const userRole = getUserRole(); 
    console.log("User Role:", userRole); // Check the user role
    setIsAdmin(userRole === 'admin');
  }, []);
  

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div>
        {/* Conditional rendering based on user's role */}
        {isAdmin ? (
          // Render admin dashboard
          <div className="flex">
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-grow">
              <AdminNavbar toggleSidebar={toggleSidebar} />
              <div className="container mx-auto">
                <Routes>
                  <Route exact path="/dashboard" element={<Dashboard />} />
                  <Route exact path="/signin" element={<Signin />} />
                  <Route path="/Employees" element={<Employees />} />
                  <Route path="/inspections" element={<Inspections />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/inspection-documents" element={<DocumentsInspections />} />
                </Routes>
              </div>
            </div>
          </div>
        ) : (
          // Render regular user routes
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<Mainpage />} />
              <Route path="/signup" element={<Registration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/bookinspection" element={<BookInspection />} />
              <Route path="/myuploads" element={<Myuploads />} />
              <Route path="/logbook" element={<Logbook />} />
              <Route path="/insurance" element={<Insurance />} />
              <Route path="/licence" element={<Licence />} />
              <Route path="/users/:id/verify/:token" element={<EmailVerify />} />
            </Routes>
            <Footer />
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
