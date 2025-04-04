import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const VideoCallComponent = () => {
  const { roomID, therapistName } = useParams();
  const user = useSelector((state) => state.user)
  // console.log({ user })

  // const type = useSelector((state) => state.auth?.type);
  // console.log({type})

  const videoCallContainer = useRef(null); // Create a ref for the video call container
  const navigate = useNavigate()

  const generateUniqueID = () => {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substring(2, 8);
    return timestamp + randomString;
  };
  useEffect(() => {
    const myMeeting = async () => {
      // Check if user and roomID are available
      if (!roomID) {
        console.error("User or roomID is missing.");
        return;
      }

      const appID = parseInt(import.meta.env.VITE_ZEGO_APP_ID);
      const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;
      const username = user?.name || therapistName || "User";

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, generateUniqueID(), username);

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      // Join the room automatically with no need for extra UI clicks
      zp.joinRoom({
        container: videoCallContainer.current, // Use the ref for the container
        sharedLinks: [
          {
            name: 'Personal link',
            url: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },

        turnOnMicrophoneWhenJoining: true, // Automatically turn on microphone
        turnOnCameraWhenJoining: true,     // Automatically turn on camera
        showPreJoinView: false,
        onLeaveRoom: () => {
          navigate('/')
        }        // Skip the pre-join view
      });
    };

    // Call the function when the component mounts
    myMeeting();
  }, [roomID, user]); // Dependencies: roomID and user

  return (
    <div>
      <div ref={videoCallContainer} style={{ width: '100%', height: '100vh' }} /> {/* Assign the ref to the div element */}
    </div>
  );
};

export default VideoCallComponent;
