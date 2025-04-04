import React, { useEffect, useState } from 'react'
import axiosInstance from '../../config/axiosConfig'

const DashBoard = () => {
    // user details
    // events
    // quiz analysis
    // interview analysis
    const [loading, setLoading] = useState(false);

    const fetchEvents = async()=>{
        try {
            const response = await axiosInstance.get('/event');
            if(response.data){
                console.log("events : " , response.data);
            }
        } catch (error) {
            console.log("events error : " , error);
        }
    }

    const fetchInterviewAnalysis = async()=>{
        try {
            const response = await axiosInstance.get('/interview-reports/get');
            if(response.data){
                console.log("interviews : " , response.data);
            }
        } catch (error) {
            console.log("interveiw error : " , error);
        }
    }


    const fetchQuizAnalysis = async()=>{
        try {
            const response = await axiosInstance.get('/quiz/user-results');
            if(response.data){
                console.log("Interview : " , response.data);
            }
        } catch (error) {
            console.log("quiz error : " , error);
        }
    }

    const fetchDetails = async()=>{
        setLoading(true);
        await fetchEvents();
        await fetchInterviewAnalysis();
        await fetchQuizAnalysis();
        setLoading(false);
    }

    useEffect(() => {
        fetchDetails();
    }, [])
    

  return (
    <div>DashBoard</div>
  )
}

export default DashBoard