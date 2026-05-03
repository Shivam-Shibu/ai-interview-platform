"use client";

import { supabase } from "@/lib/supabase";

export default function useTyping(callId, userId) {
  const sendTyping = () => {
    const channel = supabase.channel(`typing-${callId}`);

    channel.send({
      type: "broadcast",
      event: "typing",
      payload: {
        userId,
      },
    });
  };

  return { sendTyping };
}