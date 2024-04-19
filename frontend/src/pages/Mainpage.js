import React, { useEffect, useRef, useState } from 'react';
import { FaHandSparkles } from "react-icons/fa6";
import { jwtDecode } from "jwt-decode";
import 'react-toastify/dist/ReactToastify.css';
import employees from "../images/employees.jpg"
import FormPagination from '../components/FormPagination';
import { useNavigate } from 'react-router-dom';

function Mainpage() {
  // State to store the user ID
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const sectionRef = useRef({});

  // Decode the token to extract user ID
  useEffect(() => {
    // Retrieve the token from local storage
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login")
    } else {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/login")
      }
    }
  }, [navigate]);

  function navigateToUploads(sectionId) {
    if (sectionRef.current && sectionRef.current[sectionId]) {
      sectionRef.current[sectionId].scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    userId && (<>
      <header className="relative px-6 pt-14 lg:px-8" style={{ backgroundImage: `url(${employees})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="text-white relative rounded-full px-3 py-1 text-sm leading-6  ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Jkuat commutor system.{' '}
              <a href="/readmore" className="font-semibold text-indigo-600">
                <span className="absolute inset-0" aria-hidden="true" />
                Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              <i><FaHandSparkles className='mx-auto text-center justify-center' /></i>
              <h1 style={{ color: "#0F2167" }}>Vehicle Registration Made Easy</h1>
            </div>
            <p className="mt-6 text-lg leading-8 text-amber-700">
              Upload your insurance, logbook, and license documents to get commuter allowance hassle-free.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => navigateToUploads('documentUploads')}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </button>
              <a href="/learnmore" className="text-sm font-semibold leading-6 text-white">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#e5cfd8] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </header>

      {/* Features Section */}
      <div className="container mx-auto py-16">
        <h2 className="text-3xl font-semibold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Easy Document Upload</h3>
            <p>Upload your insurance, logbook, and license documents with a simple drag-and-drop interface.</p>
          </div>
          {/* Feature 2 */}
          <div className="p-6 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Fast Processing</h3>
            <p>Our streamlined process ensures quick verification and approval of your documents.</p>
          </div>
          {/* Feature 3 */}
          <div className="p-6 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Secure and Reliable</h3>
            <p>Rest assured, your documents are encrypted and stored securely on our platform.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-500 py-16 text-center text-white">
        <h2 className="text-3xl font-semibold mb-4">Ready to Get Started?</h2>
        <p className="text-lg mb-8">Join thousands of users who have already streamlined their vehicle registration process.</p>
        <button onClick={() => navigateToUploads('documentUploads')} className="bg-white text-blue-500 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-blue-400 transition duration-300">Upload Documents</button>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-200 py-8">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">What Our Users Say</h2>
          <div className="flex justify-center space-x-8">
            <div className="max-w-xs p-4 bg-white rounded-lg shadow-md">
              <img src="https://via.placeholder.com/150" alt="John Kariuki" className="mx-auto mb-4 rounded-full" />
              <p className="text-lg mb-4">"This platform made the registration process so much easier!"</p>
              <p className="font-semibold">- John Kariuki</p>
            </div>
            <div className="max-w-xs p-4 bg-white rounded-lg shadow-md">
              <img src="https://via.placeholder.com/150" alt="Jane Jane Wambui" className="mx-auto mb-4 rounded-full" />
              <p className="text-lg mb-4">"I got my commuter allowance within minutes, thanks to this portal!"</p>
              <p className="font-semibold">- Jane Wambui</p>
            </div>
          </div>
        </div>
      </div>


      {/* Document Upload Section */}
      <section id='documentUploads' ref={(el) => sectionRef.current['documentUploads'] = el}>
        <div className="p-8 rounded-lg shadow-md my-8">
          <h2 className="text-2xl font-bold mb-4 mx-auto text-center justify-center">Upload Your Documents</h2>
          {/*document upload forms*/}
          <FormPagination />
        </div>
      </section>
    </>
    )
  );
}

export default Mainpage;
