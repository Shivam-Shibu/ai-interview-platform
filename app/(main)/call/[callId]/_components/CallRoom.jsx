"use client";

import { useEffect, useState, useRef } from "react";
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Loader2 } from "lucide-react";

export default function CallRoom({
  callId,
  token,
  apiKey,
  currentUser,
  booking,
  isInterviewer,
}) {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);

  const joinedRef = useRef(false);

  useEffect(() => {
    if (!apiKey || !token || !currentUser?.id || !callId) return;

    if (joinedRef.current) return;
    joinedRef.current = true;

    const videoClient = new StreamVideoClient({
      apiKey,
      user: {
        id: currentUser.id,
        name: currentUser.name,
        image: currentUser.imageUrl,
      },
      token,
    });

    const callInstance = videoClient.call("default", callId);

    const joinCall = async () => {
      await callInstance.join({ create: true });

      setClient(videoClient);
      setCall(callInstance);
    };

    joinCall();

    return () => {
      callInstance.leave().catch(() => {});
      videoClient.disconnectUser().catch(() => {});
    };
  }, [apiKey, token, callId, currentUser]);

  if (!client || !call) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <div className="text-white p-4">
          Video Call Running...
        </div>
      </StreamCall>
    </StreamVideo>
  );
}