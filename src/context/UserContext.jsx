// Create Context
import react, { createContext, useState, useContext } from 'react'
const UserContext = createContext();


// Provider Component
export const UserProvider = ({ children }) => {
    const [email, setEmail] = useState('');


    const [link, setLink] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");

    console.log(link);
    return (
        <UserContext.Provider value={{ email, setEmail, link, setLink, country, setCountry, city, setCity }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
