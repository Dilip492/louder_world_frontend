 
 
 const BASE_URL = "https://louder-world-backend.onrender.com"

 const API_URL = {
    GETEVENTS: (country , city) => `${BASE_URL}/server1/getEvents/${country}/${city}`,
    SENDOTP:`${BASE_URL}/api/send-otp`,
    VERIFYOTP:`${BASE_URL}/api/verify-otp`,

 };

 export default API_URL;