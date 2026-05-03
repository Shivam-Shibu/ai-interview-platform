"use client";

import {
  SpeakerLayout,
  CallControls,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

export default function CallUI({ onLeave }) {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== "joined") {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Joining call...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      
      {/* 🎥 Video Area */}
      <div className="flex-1">
        <SpeakerLayout />
      </div>

      {/* 🎛️ Controls */}
      <div className="p-4 border-t border-gray-700">
        <CallControls onLeave={onLeave} />
      </div>

    </div>
  );
}