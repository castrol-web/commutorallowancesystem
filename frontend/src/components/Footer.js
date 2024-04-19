import React from 'react';
const date = new Date();

function Footer() {
    return (
        <footer className="bg-gray-800 py-6 text-white text-center fixed bottom-0 left-0 w-full">
            <div>
                <p>copyright © {date.getFullYear()} Vehicle Registration App. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer