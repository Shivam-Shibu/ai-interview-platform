



"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function ChatBox({ callId, userId }) {
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const messageIds = useRef(new Set()); // 🔥 prevent duplicates

  // ---------------- CHAT INIT ----------------
  const ensureChat = useCallback(async () => {
    let { data } = await supabase
      .from("chat")
      .select("*")
      .eq("callId", callId)
      .maybeSingle();

    if (!data) {
      const { data: newChat } = await supabase
        .from("chat")
        .insert([{ callId }])
        .select()
        .single();

      data = newChat;
    }

    setChat(data);
    return data;
  }, [callId]);

  // ---------------- LOAD MESSAGES ----------------
  const loadMessages = useCallback(async (chatId) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("chatId", chatId)
      .order("createdAt", { ascending: true })
      .limit(100); // 🔥 performance boost

    const unique = [];
    const seen = new Set();

    (data || []).forEach((m) => {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        unique.push(m);
        messageIds.current.add(m.id);
      }
    });

    setMessages(unique);
  }, []);

  // ---------------- SEND MESSAGE (OPTIMISTIC) ----------------
  const sendMessage = async () => {
    if (!text.trim() || !chat?.id) return;

    const msg = {
      id: Date.now(), // temp id
      chatId: chat.id,
      senderId: userId,
      text,
    };

    setMessages((prev) => [...prev, msg]); // 🔥 instant UI
    setText("");

    await supabase.from("messages").insert({
      chatId: chat.id,
      senderId: userId,
      text,
    });
  };

  // ---------------- REALTIME ----------------
  useEffect(() => {
    const channel = supabase
      .channel(`messages-${callId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", table: "messages" },
        (payload) => {
          const msg = payload.new;

          // 🔥 duplicate protection
          if (messageIds.current.has(msg.id)) return;

          messageIds.current.add(msg.id);

          setMessages((prev) => [...prev, msg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [callId]);

  // ---------------- INIT ----------------
  useEffect(() => {
    (async () => {
      const chatData = await ensureChat();
      if (chatData) loadMessages(chatData.id);
    })();
  }, [ensureChat, loadMessages]);

  return (
    <div className="border p-2 w-full h-full flex flex-col">
      
      {/* messages */}
      <div className="flex-1 overflow-auto space-y-1">
        {messages.map((m) => (
          <div key={m.id} className="text-sm">
            <b>{m.senderId}:</b> {m.text}
          </div>
        ))}
      </div>

      {/* input */}
      <div className="flex gap-2 mt-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          className="border flex-1 p-1"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-3"
        >
          Send
        </button>
      </div>

    </div>
  );
}