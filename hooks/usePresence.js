"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function usePresence(callId, userId) {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const channel = supabase.channel(`presence-${callId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    // 🔴 track user presence
    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();

        const users = Object.keys(state);
        setOnlineUsers(users);
      })
      .on("presence", { event: "join" }, ({ key }) => {
        console.log("User joined:", key);
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        console.log("User left:", key);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [callId, userId]);

  return {
    onlineUsers,
    isOnline: (id) => onlineUsers.includes(id),
  };
}