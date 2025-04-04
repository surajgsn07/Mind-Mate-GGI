import React, { useState } from "react";
import axios from "axios";

function ImageUpload() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [analysisResult, setAnalysisResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file)); // Generate preview URL

            // Convert to Base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setSelectedImage({ base64: reader.result, type: file.type });
            };
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedImage) {
            alert("⚠️ Please select an image first.");
            return;
        }

        setLoading(true); // Start loading

        try {
            console.log("📤 Sending Base64 image to server...");
            const response = await axios.post("http://localhost:5000/chat/img", {
                base64Img: selectedImage.base64, // Base64 image data
                mimeType: selectedImage.type, // MIME type (e.g., image/png)
                message:"Hey i got this disease today ..."
            });

            console.log("✅ Server Response:", response.data);
            setAnalysisResult(response.data.diagnosis);
        } catch (error) {
            console.error("❌ Error analyzing image:", error);
            setAnalysisResult("Failed to analyze the image.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2>🩺 Upload an Image for Disease Analysis</h2>

            {/* Upload Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{
                        padding: "8px",
                        border: "2px dashed #007bff",
                        borderRadius: "5px",
                        cursor: "pointer",
                        width: "80%",
                        maxWidth: "300px",
                    }}
                />
                <button
                    type="submit"
                    style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px",
                        transition: "0.3s",
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
                >
                    Analyze Image
                </button>
            </form>

            {/* Image Preview */}
            {imagePreview && (
                <div style={{ marginTop: "20px" }}>
                    <h3>🖼 Image Preview:</h3>
                    <img
                        src={imagePreview}
                        alt="Selected Preview"
                        style={{
                            maxWidth: "300px",
                            borderRadius: "5px",
                            boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                            transition: "0.3s ease-in-out",
                        }}
                    />
                </div>
            )}

            {/* Loading Animation */}
            {loading && (
                <div style={{ marginTop: "20px" }}>
                    <div className="spinner"></div>
                    <p>Analyzing image... Please wait.</p>
                </div>
            )}

            {/* Analysis Result */}
            {analysisResult && !loading && (
                <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <h2>📝 Analysis Result:</h2>
                    <pre
                        style={{
                            wordBreak: "break-word",
                            overflow: "auto",
                            maxWidth: "80%",
                            whiteSpace: "pre-wrap",
                            padding: "10px",
                            borderRadius: "5px",
                            textAlign: "left",
                            boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
                        }}
                    >
                        {analysisResult}
                    </pre>
                </div>
            )}

            {/* Loading Animation Styles */}
            <style>
                {`
                    .spinner {
                        width: 40px;
                        height: 40px;
                        border: 4px solid rgba(0, 123, 255, 0.3);
                        border-radius: 50%;
                        border-top: 4px solid #007bff;
                        animation: spin 1s linear infinite;
                        margin: auto;
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
}

export default ImageUpload;
