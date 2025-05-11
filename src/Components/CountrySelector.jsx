
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';


const CountrySelector = () => {
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const { setCountry, setCity } = useUser();

    const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
        setSelectedCity('');
    };

   

    setCountry(selectedCountry);
    setCity(selectedCity);


    const countries = {
        USA: ['New York', 'Los Angeles', 'Chicago', 'San Francisco'],
        India: ['Delhi', 'Mumbai', 'Bangalore' , ],
        Canada: ['Toronto', 'Vancouver', 'Montreal'],
        Australia: ['Sydney', 'Melbourne', 'Brisbane'],
    };


    return (
        <div className="max-w-md mx-auto mt-16 p-8 bg-white shadow-lg rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                🌍 Select Country and City
            </h2>

            {/* Country Selector */}
            <div className="mb-2">
                <label className="block mb-1 text-sm font-medium text-gray-600">Country</label>
                <select
                    className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                >
                    <option value="">-- Select Country --</option>
                    {Object.keys(countries).map((country) => (
                        <option key={country} value={country}>
                            {country}
                        </option>
                    ))}
                </select>
            </div>

            {/* City Selector */}
            {selectedCountry && (
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-600">City</label>
                    <select
                        className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                    >
                        <option value="">-- Select City --</option>
                        {countries[selectedCountry].map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Result Message */}
            {selectedCity && (
                <div className="p-4 mt-4 text-center text-sm bg-green-100 text-green-700 border border-green-300 rounded">
                    ✅ You selected: <span className="font-medium">{selectedCountry}, {selectedCity}</span>
                </div>
            )}
        </div>

    );
};

export default CountrySelector;
