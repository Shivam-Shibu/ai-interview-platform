import { supabase } from "./supabase";

// send message
export const sendMessage = async ({ chat_id, senderId, text }) => {
  return await supabase.from("messages").insert({
    chat_id,
    senderId,
    text,
    seen: false,
  });
};

// mark seen
export const markSeen = async (chat_id, userId) => {
  return await supabase
    .from("messages")
    .update({ seen: true })
    .eq("chat_id", chat_id)
    .neq("senderId", userId);
};

// add reaction
export const addReaction = async (messageId, reaction) => {
  return await supabase
    .from("messages")
    .update({ reaction })
    .eq("id", messageId);
};