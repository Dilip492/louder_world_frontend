import React from 'react'
import { Calendar, MapPin, Clock } from 'lucide-react';

import { useState } from 'react';
import { redirect, useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';
import CountrySelector from './CountrySelector';
import  API_url  from '../Config/API.url'

const Card = () => {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [data, setData] = useState([])

  const navigate = useNavigate();

  const { setLink, city, country } = useUser();



 

  const url = API_url.GETEVENTS(country, city);
  const GetEventlist = async () => {
    setLoading(true)
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          "Content-type": "application/json"
        }
      })
      const data = await response.json();
     
      setData(data.data)
      setError("");

    } catch (error) {
      setError(error || "Something went wrong. Please try again later.");
      alert("sorry something went wrong")
      console.log("Error fetching events:", error);
    } finally {
      setLoading(false)
    }
  }



  const handlclick = (link) => {
    setLink(link)
    navigate("/Emailverify")
  }


  // 


  return (


    <div>

      {/* <SearchBar /> */}
      <CountrySelector />

      <div>
        {
          country && city ? (

            <div className="relative group">
              <button
                onClick={() => GetEventlist()}
                className="m-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-all duration-200 ease-in-out"
              >
                Click to Show Events
              </button>
              <div className="absolute bottom-12 left-1/15  transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-md px-2 py-1 z-10">
                Click again to latest events
              </div>
            </div>
          ) : null
        }
        {error && (
          <p className="text-red-500 text-xl flex items-center justify-center mt-4">
            Something went wrong: {error}
          </p>
        )}



        {loading && (
          <p className="text-gray-600 text-4xl animate-pulse mt-4 flex items-center justify-center">
            Data loading... please wait..
          </p>
        )}




        {data.length === 0 && !loading && !error && (
          <p className="text-gray-600 text-4xl mt-4 flex items-center justify-center">
            No events found
          </p>
        )}


        {data.length > 0 && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>

            {data.map((event, index) => {
              return (

                <div key={index} className="group h-full bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 m-2">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt="image"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1">
                      Featured
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-1/3"></div>
                  </div>

                  <div className="p-5">
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full">
                        {event.update === " " ? "" : event.update}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mb-2 text-gray-900 line-clamp-3 group-hover:text-purple-700 transition-colors duration-200">
                      {event.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {
                      event.update === event.date ? "" :
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{event.date}</span>
                        </div>
                    }

                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>evening</span>
                    </div>

                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>


                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                    <button onClick={() => handlclick(event.link)} className="w-full py-1.5 text-sm font-medium text-purple-700 hover:text-purple-900 transition-colors duration-200 cursor-pointer">
                      Get Tickets
                    </button>
                  </div>
                </div>

              )
            })}
          </div>

        )}



      </div>



    </div>


  )
}

export default Card
