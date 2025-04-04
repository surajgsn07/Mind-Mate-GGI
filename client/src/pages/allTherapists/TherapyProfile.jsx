import React, { useEffect, useState } from 'react';
import axiosInstance from '../../config/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import dayjs from 'dayjs';
import { FaClock, FaEnvelope, FaPhone, FaMars, FaVenus } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function TherapyProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [therapist, setTherapist] = useState(null);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false); // Track full-page loading

    useEffect(() => {
        const fetchSlot = async () => {
            try {
                const response = await axiosInstance.get(`/slot/${id}`);
                setSlots(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchSlot();
    }, [id]);

    useEffect(() => {
        const fetchTherapist = async () => {
            try {
                const response = await axiosInstance.get(`/therapist/${id}`);
                setTherapist(response.data?.therapist);
            } catch (error) {
                console.error(error);
            }
        };
        fetchTherapist();
    }, [id]);
    const handleBooking = async (slotId) => {
        setLoading(true); // Show full-page loader
        try {
            console.log(slotId);
            const { data } = await axiosInstance.post('/appointment/book', {
                therapistId: id,
                slotId
            });
    
            const { id: orderId, amount, currency } = data.order;
    
            const options = {
                key: import.meta.env.VITE_RAZORPAY_API_KEY,
                amount: amount / 100,
                currency,
                name: "Therapy Session",
                description: "1:1 Consultation",
                order_id: orderId,
                handler: async function (response) {
                    setLoading(false); // Hide loader after Razorpay opens
    
                    // Call /verify-payment endpoint
                    try {
                        const verifyResponse = await axiosInstance.post('/appointment/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
    
                        if (verifyResponse.data.status) {
                            toast.success("Payment successful! Appointment confirmed.");
                            navigate('/appointments');
                        } else {
                            toast.error("Payment verification failed. Please contact support.");
                        }
                    } catch (verifyError) {
                        console.error("Payment verification error:", verifyError);
                        toast.error("Failed to verify payment. Please try again.");
                    }
                },
                prefill: {
                    name: "John Doe",
                    email: "johndoe@example.com",
                    contact: "9876543210"
                },
                theme: { color: "#3399cc" }
            };
            const razorpay = new window.Razorpay(options);
            razorpay.open();
            setLoading(false); // Hide loader after Razorpay popup opens
        } catch (error) {
            console.error("Booking error:", error);
            alert("Failed to book appointment.");
            setLoading(false); // Hide loader if there's an error
        }
    };
    
    if (!therapist) {
        return (
            <div className="flex flex-col flex-wrap min-h-screen gap-6 p-6 bg-white shadow-lg rounded-lg">
                {/* Skeleton for Left Side (Profile Card) */}
                <div className="flex-1">
                    <div className='bg-gradient-to-r from-gray-300 to-gray-400 drop-shadow-lg max-w-md mx-auto px-8 py-10 rounded-4xl'>
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full bg-gray-300 animate-pulse"></div>
                            <div className="h-6 w-40 bg-gray-300 animate-pulse mt-4 rounded-md"></div>
                            <div className="h-4 w-32 bg-gray-300 animate-pulse mt-2 rounded-md"></div>
                            <div className="h-4 w-24 bg-gray-300 animate-pulse mt-2 rounded-md"></div>
                        </div>
                        <div className="mt-6 border-t pt-4 text-center">
                            <div className="h-4 w-48 bg-gray-300 animate-pulse mx-auto rounded-md"></div>
                        </div>
                        <div className="mt-6 border-t pt-4 text-center">
                            <div className="h-8 w-24 bg-gray-300 animate-pulse mx-auto rounded-md"></div>
                        </div>
                    </div>
                </div>
    
                {/* Skeleton for Right Side (Slots Section) */}
                <div className="flex-1 rounded-2xl p-4">
                    <div className="h-6 w-48 bg-gray-300 animate-pulse mb-4 rounded-md"></div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array(6).fill(0).map((_, index) => (
                            <div key={index} className="bg-gray-200 p-4 w-full py-10 rounded-lg animate-pulse shadow-md flex flex-col items-center">
                                <div className="h-4 w-32 bg-gray-300 animate-pulse rounded-md"></div>
                                <div className="h-4 w-20 bg-gray-300 animate-pulse mt-2 rounded-md"></div>
                                <div className="h-8 w-24 bg-gray-300 animate-pulse mt-4 rounded-md"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    

    return (
        <div className="relative">
            {/* Full-Screen Loader */}
            {loading && (
                <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <div className="flex-col lg:flex-row flex flex-wrap min-h-screen gap-6 p-6 bg-white shadow-lg rounded-lg">
                <div className="flex-1">
                    <div className='bg-gradient-to-r from-teal-900 to-teal-700 drop-shadow-lg max-w-md mx-auto px-8 py-10 rounded-4xl text-white'> 
                        <div className="flex flex-col items-center">
                            <img
                                src={therapist.avatar || "https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg?semt=ais_hybrid"}
                                alt={therapist.name}
                                className="w-32 h-32 rounded-full object-cover shadow-md"
                            />
                            <h1 className="text-2xl font-semibold text-white mt-4 flex items-center gap-2">
                                Dr. {therapist.name} <RiVerifiedBadgeFill className="text-white" />
                            </h1>
                            <p className="text-gray-200 text-sm">Specialized in {therapist.specialization.join(', ')}</p>
                            <p className="text-gray-100 flex items-center mt-2">
                                <FaClock className="mr-2" /> {therapist.experience}+ Years Experience
                            </p>
                        </div>

                        <div className="mt-6 border-t pt-4">
                            <h3 className="text-lg font-semibold text-gray-100 text-center">Book 1:1 Consultation</h3>
                        </div>

                        <div className="mt-6 border-t pt-4 text-center">
                            <h3 className="text-lg font-semibold text-gray-100">Consultation Fees</h3>
                            <p className="text-gray-100 mt-2">
                                <span className="font-bold text-white text-2xl">₹{therapist.virtualFee}</span> / Online Session
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 rounded-2xl p-4"> 
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Slots</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-3  gap-4">
                        {slots.length > 0 ? slots.map((slot, index) => (
                            <div key={index} className="bg-white border-[1px] border-teal-800 p-4 w-full py-10 rounded-lg shadow-md flex flex-col items-center">
                                <p className="text-gray-800 italic font-semibold">{dayjs(slot.date).format('DD MMM YYYY')}</p>
                                <p className="text-gray-600 text-lg font-bold">{slot.timeSlot}</p>
                                <button
                                    className="mt-2 bg-gradient-to-r from-teal-600 to-teal-800 text-white py-1 px-4 rounded-lg shadow hover:bg-green-700 disabled:opacity-50"
                                    onClick={() => handleBooking(slot._id)}
                                    disabled={loading} // Disable all buttons when loading
                                >
                                    {loading ? "Booking..." : "Book Slot"}
                                </button>
                            </div>
                        )) : <p className="text-gray-600">No slots available</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}