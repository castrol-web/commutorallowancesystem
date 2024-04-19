import React, { useState } from 'react';
import Logbook from '../pages/Logbook';
import Insurance from '../pages/Insurance';
import Licence from '../pages/Licence';

function FormPagination() {
    const [currentForm, setCurrentForm] = useState(1);

    const handleNextForm = () => {
        setCurrentForm(currentForm + 1);
    };

    return (
        <div>
            {currentForm === 1 && <Logbook onNextForm={handleNextForm} />}
            {currentForm === 2 && <Insurance onNextForm={handleNextForm} />}
            {currentForm === 3 && <Licence />}
        </div>
    );
}

export default FormPagination;
