import { useEffect, useState } from "react";
import axiosInstance from "../config/axiosConfig";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import moment from "moment";
import { Link } from "react-router-dom";


function Analysis() {
  const [analysis, setAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log({analysis})

  async function getAnalysis() {
    try {
      const response = await axiosInstance.get("/chat/reports");
      setAnalysis(response.data.reports);
    } catch (error) {
      console.error("Error fetching analysis data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAnalysis();
  }, []);

  const emotionIcons = {
    sad: "😢",
    happy: "😊",
    neutral: "😐",
    angry: "😡",
    disgust: "🤢",
    fear: "😱",
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-center mb-6">Mental Health Analysis 📊</h1>
      {!loading && analysis.length > 0 && (
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Engagement & Sentiment Analysis</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={analysis.reduce((acc, item) => {
                const date = moment(item.createdAt).format("MMM Do");
                const existing = acc.find((d) => d.name === date);
                if (existing) {
                  existing.Messages += item.totalMessages;
                  existing.Engagement = (existing.Engagement + item.userEngagementScore) / 2;
                } else {
                  acc.push({
                    name: date,
                    Messages: item.totalMessages,
                    Engagement: item.userEngagementScore,
                  });
                }
                return acc;
              }, [])}
            >
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip cursor={{ fill: "#333" }} contentStyle={{ backgroundColor: "#222", color: "#fff" }} />
              <Legend />
              <Bar dataKey="Messages" fill="#82ca9d" barSize={40} />
              <Bar dataKey="Engagement" fill="#8884d8" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse">
              <div className="h-6 bg-gray-700 w-3/4 mb-4 rounded"></div>
              <div className="h-4 bg-gray-700 w-1/2 mb-2 rounded"></div>
              <div className="h-4 bg-gray-700 w-2/3 mb-2 rounded"></div>
              <div className="h-4 bg-gray-700 w-1/3 rounded"></div>
            </div>
          ))}
        </div>
      ) : analysis.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <p className="text-gray-400 text-lg mb-4">No chat analysis available yet.</p>
          <Link to={"/chat"} className="bg-blue-500 px-6 py-3 rounded-lg text-white font-semibold hover:bg-blue-600">Start a Chat</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {analysis.map((item) => (
            <div key={item._id} className="bg-gray-800 flex flex-col gap-3 p-6 rounded-lg shadow-lg relative">
              {/* Show large emojis for dominant emotions at the top of each card */}
              <div className="flex justify-center text-5xl mb-4">
                {item.dominantEmotions.map((emotion, index) => (
                  <span key={index} className="mx-2">{emotionIcons[emotion] || "😐"}</span>
                ))}
              </div>

              <h2 className="text-xl font-semibold mb-2">Conversation Summary</h2>
              <p className="text-gray-300 mb-2">{item.conversationSummary}</p>
              
              <div className="flex items-center gap-3 mb-2">
                <span className="font-medium text-lg">Dominant Emotion:</span> 
                {item.dominantEmotions.map((emotion, index) => (
                  <span key={index} className="text-xl">{emotionIcons[emotion] || "😐"} </span>
                ))}
                <span className="capitalize">{item.dominantEmotions.join(", ")}</span>
              </div>

              <p className="text-lg"><span className="font-medium">Messages:</span> {item.userMessages+item.botMessages} (User: {item.userMessages}, Bot: {item.botMessages})</p>
              
              <p className="text-lg">
                <span className="font-medium">Sentiment Trend: </span>
                {item.sentimentTrend.split(' ').map((emotion, index) => (
                  <span key={index}>
                    {emotion} {emotionIcons[emotion.toLowerCase()] || "😐"}{" "}
                  </span>
                ))}
              </p>

              <p className="text-lg">Engagement Score: {item.userEngagementScore}</p>
              <div className="h-2 w-full rounded bg-gray-600 mt-1">
                <div
                  className={`h-2 rounded ${
                    item.userEngagementScore <= 3
                      ? "bg-red-500"
                      : item.userEngagementScore <= 7
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${item.userEngagementScore * 10}%` }}
                ></div>
              </div>
              <div className="text-lg mt-2 " > <span className="font-semibold" >Suggestion  :</span>  {item.solution || "No suggestion"} </div>
              <p className="text-sm text-gray-400">{moment(item.createdAt).fromNow()}</p>
            </div>
          ))}
        </div>
      )}

     
    </div>
  );
}

export default Analysis;
