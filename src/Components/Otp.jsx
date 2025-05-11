
import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router';
import API_URL from '../Config/API.url';

const Otp = () => {
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const { link, email } = useUser();
    const inputRefs = useRef([]);

    const navigate = useNavigate();

    useEffect(() => {
        let countdown;
        if (timer > 0) {
            countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
        } else {
            setCanResend(true);
        }
        return () => clearTimeout(countdown);
    }, [timer]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only one digit
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

 

    console.log(otp)

    const handleSubmit = async () => {
        const enteredOtp = otp.join('');
        console.log(enteredOtp)

       

        try {
            const response = await fetch(API_URL.VERIFYOTP, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ "email": email, "otp": enteredOtp })
            })
            setOtp();
            const res = await response.json();
            if (response.status == 200) {
                alert(res.message);
                window.open(`${link}`)
                navigate("/")
                
            }
        } catch (error) {
            console.log("error verify otp", error);
            alert(error.message);
        }


    };

    
    const handleResend = async () => {
        setOtp(new Array(6).fill(''));
        setTimer(30);
        setCanResend(false);

        const response = await fetch(API_URL.SENDOTP, {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ "email": email })

        })

        const res = await response.json();
        if (response.status == 200) {
            alert("otp resent")
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <h2 className="text-2xl font-semibold mb-4">Verify OTP</h2>
            <p className="text-gray-500 text-sm mb-4 font-semibold text-center">
                We have sent an OTP to your email address. Please check your inbox and enter the OTP securely.
            </p>
            <div className="flex gap-2 mb-6">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={digit}
                        ref={(el) => (inputRefs.current[index] = el)}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-12 h-12 text-center border border-gray-400 rounded-md text-xl focus:outline-none focus:border-blue-500"
                        style={{
                            MozAppearance: 'textfield',
                            WebkitAppearance: 'none',
                            appearance: 'none'
                        }}
                    />
                ))}
            </div>
            <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
                Submit
            </button>

            <div className="text-sm text-gray-600 mt-2">
                {!canResend ? (
                    <p>
                        Didn’t receive the code?{' '}
                        <span className="font-medium text-gray-800">
                            Resend in {timer}s
                        </span>
                    </p>
                ) : (
                    <p>
                        Didn’t receive the code?{' '}
                        <button
                            onClick={handleResend}
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Resend OTP
                        </button>
                    </p>
                )}
            </div>


        </div>
    );
};

export default Otp;
