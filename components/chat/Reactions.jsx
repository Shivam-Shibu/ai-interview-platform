"use client";

import { useState } from "react";
import { addReaction } from "@/lib/chatService";

const QUICK_REACTIONS = ["❤️", "😂", "👍", "🔥", "😮"];

const MORE_REACTIONS = [
  "😍", "😢", "😡", "👏", "🙏", "💯", "🎉", "🤯"
];

export default function Reaction({ messageId }) {
  const [open, setOpen] = useState(false);

  const handleReaction = async (emoji) => {
    await addReaction(messageId, emoji);
    setOpen(false);
  };

  return (
    <div className="relative mt-1">

      {/* QUICK REACTIONS */}
      <div className="flex gap-2 text-lg">
        {QUICK_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleReaction(emoji)}
            className="hover:scale-125 transition"
          >
            {emoji}
          </button>
        ))}

        {/* MORE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="text-sm text-gray-500"
        >
          ➕
        </button>
      </div>

      {/* EXPANDED PANEL */}
      {open && (
        <div className="absolute bg-white border shadow-lg p-2 rounded-lg flex flex-wrap gap-2 mt-2 z-10">
          {MORE_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className="text-xl hover:scale-125 transition"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}