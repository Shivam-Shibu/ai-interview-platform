"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export default function useChat(callId, userId) {
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);

  // 1. create / get chat
  const ensureChat = useCallback(async () => {
    let { data } = await supabase
      .from("chat")
      .select("*")
      .eq("call_id", callId)
      .single();

    if (!data) {
      const res = await supabase
        .from("chat")
        .insert([{ call_id: callId }])
        .select()
        .single();

      data = res.data;
    }

    setChat(data);
    return data;
  }, [callId]);

  // 2. load messages
  const loadMessages = useCallback(async (chatId) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    setMessages(data || []);
  }, []);

  // 3. send message
  const sendMessage = async (text) => {
    if (!text.trim() || !chat) return;

    await supabase.from("messages").insert({
      chat_id: chat.id,
      sender_id: userId,
      text,
      seen: false,
    });
  };

  // 4. realtime messages
  useEffect(() => {
    const channel = supabase
      .channel(`messages-${callId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", table: "messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [callId]);

  // 5. init
  useEffect(() => {
    (async () => {
      const chatData = await ensureChat();
      if (chatData) loadMessages(chatData.id);
    })();
  }, [ensureChat, loadMessages]);

  return {
    chat,
    messages,
    sendMessage,
    reload: () => chat && loadMessages(chat.id),
  };
}