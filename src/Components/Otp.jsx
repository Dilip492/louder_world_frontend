import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router';
import API_URL from '../Config/API.url';

const Otp = () => {
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const { link, email } = useUser();
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    // Timer countdown
    useEffect(() => {
        let countdown;
        if (timer > 0) {
            countdown = setTimeout(() => setTimer(prev => prev - 1), 1000);
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

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
        
        // Auto-submit when last digit is entered
        if (value && index === 5) {
            handleSubmit();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async () => {
        const enteredOtp = otp.join('');
        
        // if (enteredOtp.length !== 6) {
        //     alert('Please enter a complete 6-digit OTP');
        //     return;
        // }

        setIsSubmitting(true);
        
        try {
            const response = await fetch(API_URL.VERIFYOTP, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, otp: enteredOtp })
            });

            const res = await response.json();
            
            if (response.ok) {
                alert(res.message);
                window.open(link, '_blank');
                navigate("/");
            } 
        } catch (error) {
            console.error("Error verifying OTP:", error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        
        setIsResending(true);
        setOtp(new Array(6).fill(''));
        setTimer(30);
        setCanResend(false);

        try {
            const response = await fetch(API_URL.SENDOTP, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const res = await response.json();
            
            if (!response.ok) {
                throw new Error(res.message || 'Failed to resend OTP');
            }
            
            alert("OTP has been resent");
            inputRefs.current[0]?.focus();
        } catch (error) {
            console.error("Error resending OTP:", error);
            alert(error.message);
            setCanResend(true);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
            <div className=" bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-center">Verify OTP</h2>
                <p className="text-gray-600 mb-6 text-center">
                    We've sent a 6-digit code to <span className="font-medium">{email}</span>
                </p>
                
                <div className="flex justify-center gap-3 mb-8">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            ref={(el) => (inputRefs.current[index] = el)}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-12 h-12 text-center border-2 border-gray-300 rounded-md text-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition"
                            disabled={isSubmitting}
                        />
                    ))}
                </div>
                
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || otp.join('').length !== 6}
                    className={`w-full py-3 px-4 rounded-md font-medium transition ${
                        isSubmitting || otp.join('').length !== 6
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                    {isSubmitting ? 'Verifying...' : 'Verify'}
                </button>
                
                <div className="text-center mt-6 text-sm text-gray-600">
                    {!canResend ? (
                        <p>
                            Didn't receive the code? Resend in{' '}
                            <span className="font-medium">{timer}s</span>
                        </p>
                    ) : (
                        <button
                            onClick={handleResend}
                            disabled={isResending}
                            className={`text-blue-600 font-medium ${
                                isResending ? 'opacity-50' : 'hover:underline'
                            }`}
                        >
                            {isResending ? 'Sending...' : 'Resend OTP'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Otp;