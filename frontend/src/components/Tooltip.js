import React, { useState } from 'react'

function Tooltip({ text, children }) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className='relative mr-10 mt-4'
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {isVisible && <div className='absolute mt-6 bg-black text-white p-2 rounded-md min-w-2'>{text}</div>}
            {children}
        </div>
    )
}

export default Tooltip