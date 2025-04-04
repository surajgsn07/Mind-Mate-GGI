import React, { useEffect, useState } from "react";
import { FaPhone } from "react-icons/fa6";
import { useSelector } from "react-redux";
import axiosInstance from "../../config/axiosConfig";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

export default function Appointment() {
  const currUser = useSelector((state) => state.user);
  const [allAppointments, setAllAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get("/appointment/my-appointments");
        setAllAppointments(response.data.appointments);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="lg:px-30 md:px-15 p-4 md:py-10">
      <h1 className="text-3xl bg-gradient-to-r from-teal-800 to-teal-200 bg-clip-text text-transparent font-bold">
        MY APPOINTMENTS
      </h1>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allAppointments && allAppointments.length > 0 ? (
          allAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="border-2 border-teal-400 shadow-md rounded-2xl p-4"
            >
              <div className="my-4">
                <h1 className="text-2xl font-bold">{appointment.therapistId.name}</h1>
                <p className="text-gray-500">
                  Date: {dayjs(appointment.slotId.date).format("DD MMM, YYYY")}
                </p>
                <p className='text-gray-500'>Time: {appointment.slotId.timeSlot}</p>
              </div>

              <Link to ={`/vc/${appointment.roomId}`} className="mt-4 bg-teal-600 hover:opacity-75 text-white text-center py-2 rounded-lg flex items-center gap-3 justify-center">
                <FaPhone />
                JOIN CALL
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-3">No appointments found.</p>
        )}
      </div>
    </div>
  );
}
