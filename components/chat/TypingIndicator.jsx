"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TypingIndicator({ callId, currentUserId }) {
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    const channel = supabase.channel(`typing-${callId}`);

    // listen typing event
    channel
      .on("broadcast", { event: "typing" }, (payload) => {
        if (payload.payload.userId !== currentUserId) {
          setTypingUser(payload.payload.userId);

          setTimeout(() => {
            setTypingUser(null);
          }, 1500);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [callId, currentUserId]);

  if (!typingUser) return null;

  return (
    <div className="text-sm text-gray-500 italic px-2 py-1 animate-pulse">
      {typingUser} is typing...
    </div>
  );
}