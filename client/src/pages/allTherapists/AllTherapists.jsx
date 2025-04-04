import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../config/axiosConfig';
import { FaPhone } from "react-icons/fa6";

export default function AllTherapists() {
  const [search, setSearch] = useState('');
  const [allTherapists, setAllTherapists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await axiosInstance.get('/therapist/all');
        setAllTherapists(response.data.therapists);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTherapists();
  }, []);

  const filteredTherapists = allTherapists.filter((therapist) =>
    therapist.name?.toLowerCase().includes(search.toLowerCase()) ||
    therapist.specialization?.some((spec) =>
      spec.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className='lg:px-30 md:px-15 p-4 md:py-10 min-h-screen'>
      <div className='flex mb-10 justify-center'>
        <input
          type='text'
          placeholder='Search by Specialization...'
          className='w-full max-w-md border border-gray-300 rounded-lg shadow-sm p-2'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className='shadow-md p-4 rounded-2xl max-w-[340px] border-2 py-10 border-gray-300 animate-pulse'>
                <div className='w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4'></div>
                <div className='h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2'></div>
                <div className='h-3 bg-gray-300 rounded w-2/3 mx-auto mb-2'></div>
                <div className='h-3 bg-gray-300 rounded w-1/2 mx-auto mb-2'></div>
                <div className='h-10 bg-gray-300 rounded w-full mt-4'></div>
              </div>
            ))
          : filteredTherapists.map((therapist) => (
              <div key={therapist.id} className='shadow-md p-4 flex flex-col justify-between rounded-2xl 
               max-w-[340px] border-2 py-10 border-teal-600 drop-shadow-lg'>
                <div className='flex items-center justify-center relative'>
                  <img src='https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg?semt=ais_hybrid' alt={therapist.name} className='w-24 h-24 relative z-10 bg-white border-2 border-emerald-800 rounded-full mx-auto mb-4' />
                </div>
                <h3 className='text-xl font-semibold text-center'>{therapist.name}</h3>
                <div className='mt-2'>
                  <p className='text-center'>Specialized in: {therapist.specialization.join(', ')}</p>
                  <p className='text-center'>Exp: {therapist.experience} years</p>
                </div>
                <div className='bg-gradient-to-r mt-5 flex items-center py-4 justify-betweenpx-4 rounded-md'>
                  <p className='text-center'>Fee: <span className='text-2xl font-bold text-transparent bg-gradient-to-r from-teal-700 to-teal-500 bg-clip-text'>{therapist.virtualFee}</span></p>
                </div>
                <Link to={`/mentor/${therapist._id}`} className='bg-gradient-to-r flex items-center gap-2 hover:opacity-60 from-teal-700 to-teal-800 text-white py-2 px-4 rounded-md'>
                    <FaPhone />
                    Book a Call
                </Link>
              </div>
            ))}
      </div>
    </div>
  );
}