"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ChatInput({ chatId, userId }) {
  const [text, setText] = useState("");

  const sendMessage = async () => {
    if (!text.trim()) return;

    await supabase.from("messages").insert({
      chat_id: chatId,
      sender_id: userId,
      text,
      seen: false,
    });

    setText("");
  };

  return (
    <div className="flex gap-2 p-2 border-t">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="border flex-1 p-2 rounded"
      />

      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 rounded"
      >
        Send
      </button>
    </div>
  );
}