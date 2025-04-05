import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import * as faceapi from "face-api.js";

const FaceRecognition = forwardRef(
  (
    {
      videoWidth = 720,
      videoHeight = 560,
      intervalTime = 500,
      showDetails = true,
      className = "",
    },
    ref
  ) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [faceData, setFaceData] = useState([]);

    useImperativeHandle(ref, () => ({
      getFaceData: () => faceData,
    }));

    useEffect(() => {
      const loadModels = async () => {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelsLoaded(true);
      };

      loadModels();
    }, []);

    useEffect(() => {
      if (isModelsLoaded) {
        startVideo();
      }
    }, [isModelsLoaded]);

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Error accessing webcam:", err));
    };

    const handleVideoOnPlay = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) return;

      faceapi.matchDimensions(canvas, {
        width: videoWidth,
        height: videoHeight,
      });

      const interval = setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender();

        const resizedDetections = faceapi.resizeResults(detections, {
          width: videoWidth,
          height: videoHeight,
        });

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        const data = resizedDetections.map((det, i) => {
          const { detection, expressions, age, gender, genderProbability } = det;
          const { x, y, width, height } = detection.box;

          const expressionData = Object.entries(expressions).map(
            ([key, value]) => ({
              name: key,
              confidence: (value * 100).toFixed(1),
            })
          );

          return {
            faceNumber: i + 1,
            confidence: (detection.score * 100).toFixed(1),
            age: age.toFixed(1),
            gender,
            genderConfidence: (genderProbability * 100).toFixed(1),
            expressions: expressionData,
            box: {
              x: x.toFixed(1),
              y: y.toFixed(1),
              width: width.toFixed(1),
              height: height.toFixed(1),
            },
          };
        });

        setFaceData(data);
      }, intervalTime);

      return () => clearInterval(interval);
    };

    return (
      <div className={`flex flex-col items-center mt-8 px-4 ${className}`}>
        <div style={{ position: "relative" }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            width={videoWidth}
            height={videoHeight}
            onPlay={handleVideoOnPlay}
            style={{ borderRadius: "12px" }}
          />
          <canvas
            ref={canvasRef}
            width={videoWidth}
            height={videoHeight}
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        </div>

        {showDetails && (
          <div className="mt-6 w-full max-w-3xl">
            <h3 className="text-xl font-semibold mb-2">🧠 Detected Face Details</h3>
            {faceData.length === 0 ? (
              <p className="text-gray-500">No face detected</p>
            ) : (
              faceData.map((face, idx) => (
               <></>
              ))
            )}
          </div>
        )}
      </div>
    );
  }
);

export default FaceRecognition;
