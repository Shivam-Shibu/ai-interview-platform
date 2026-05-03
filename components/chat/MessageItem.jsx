"use client";

import { addReaction } from "@/lib/chatService";

export default function MessageItem({ message, currentUserId }) {
  const isOwnMessage = message.sender_id === currentUserId;

  const handleReaction = async (emoji) => {
    await addReaction(message.id, emoji);
  };

  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`p-2 rounded-lg max-w-[70%] relative ${
          isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        {/* MESSAGE TEXT */}
        <p className="text-sm">{message.text}</p>

        {/* REACTION DISPLAY */}
        {message.reaction && (
          <span className="absolute -bottom-4 right-2 text-lg">
            {message.reaction}
          </span>
        )}

        {/* SEEN STATUS */}
        {isOwnMessage && message.seen && (
          <p className="text-[10px] text-right mt-1 opacity-70">
            ✓✓ seen
          </p>
        )}

        {/* REACTION BUTTONS */}
        <div className="flex gap-2 mt-2 text-sm">
          <button onClick={() => handleReaction("❤️")}>❤️</button>
          <button onClick={() => handleReaction("😂")}>😂</button>
          <button onClick={() => handleReaction("👍")}>👍</button>
        </div>
      </div>
    </div>
  );
}