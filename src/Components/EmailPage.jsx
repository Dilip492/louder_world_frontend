import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';
import API_URL from '../Config/API.url';


const EmailPage = () => {

    // const [email, setEmail] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [message, setMessage] = useState('');
    const { email, setEmail } = useUser();
    const navigate = useNavigate();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setMessage('');
        setIsValid(true);
    };


   
    const url = API_URL.SENDOTP;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (emailRegex.test(email)) {
            setMessage('Email is valid! Proceeding...');
            setIsValid(true);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ "email": email })
            })

            const res = await response.json();
            if (response.status == 200) {
                alert(res.message)
                navigate("/OtpVerification")
            }

        } else {
            setMessage('Please enter a valid email address.');
            setIsValid(false);
        }
    };

    return (
        <div>
            <div className='flex items-center justify-center min-h-screen bg-gray-100'>



                <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg ">
                    <h2 className="text-2xl font-semibold text-center mb-6">Email Verification</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter your email"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        >
                            Verify Email
                        </button>
                    </form>
                    {message && (
                        <p className={`mt-4 text-center text-lg ${isValid ? 'text-green-500' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EmailPage
