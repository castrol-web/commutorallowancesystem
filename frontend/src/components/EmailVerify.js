import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams,useNavigate} from 'react-router-dom';
import axios from 'axios';
//importing backend route
import { URL } from "../App";


function EmailVerify() {
    const [validUrl, setValidUrl] = useState(false);
    const navigate = useNavigate();
    const param = useParams();

    useEffect(() => {
        async function verifyEmailUrl() {
            try {
                const url = `${URL}/api/users/${param.id}/verify/${param.token}`;
                const { data } = await axios.get(url);
                console.log(data)
                setValidUrl(true);
            } catch (error) {
                console.log(error);
                setValidUrl(false);
            }
        };
        verifyEmailUrl()
    }, [param]);
        // Handle navigation to Mainpage upon successful verification
        useEffect(() => {
            if (validUrl) {
                navigate('/');
            }
        }, [validUrl, navigate]);
    return (
        <Fragment>
            {validUrl ? (
                <div className='verify_container'>
                <div>
                <h1>Email verified successfully</h1>
                    <h1>Email verified successfully</h1>
                    <h1>Email verified successfully</h1>
                    <h1>Email verified successfully</h1>
                    
                </div>
                  
                    <Link to="/">
                        <button type='button'>Continue to Main page</button>
                    </Link>
                </div>
            ) :
                <h1>404 Not Found</h1>
            }
        </Fragment>
    )
}

export default EmailVerify;