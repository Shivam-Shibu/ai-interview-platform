// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { supabase } from "@/lib/supabase";

// export default function ChatBox({ callId, userId }) {
//   const [chat, setChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");

//   const ensureChat = useCallback(async () => {
//     let { data } = await supabase
//       .from("chat")
//       .select("*")
//       .eq("callId", callId)
//       .maybeSingle();

//     if (!data) {
//       const { data: newChat, error } = await supabase
//         .from("chat")
//         .insert([{ callId }])
//         .select()
//         .single();

//       if (error) return null;
//       data = newChat;
//     }

//     setChat(data);
//     return data;
//   }, [callId]);

//   const loadMessages = useCallback(async (chatId) => {
//     const { data } = await supabase
//       .from("messages")
//       .select("*")
//       .eq("chatId", chatId)
//       .order("createdAt", { ascending: true });

//     setMessages(data || []);
//   }, []);

//   const sendMessage = async () => {
//     if (!text || !chat?.id) return;

//     await supabase.from("messages").insert({
//       chatId: chat.id,
//       senderId: userId,
//       text,
//     });

//     setText("");
//   };

//   useEffect(() => {
//     const channel = supabase
//       .channel(`messages-${callId}`)
//       .on(
//         "postgres_changes",
//         { event: "INSERT", table: "messages" },
//         (payload) => {
//           setMessages((prev) => [...prev, payload.new]);
//         }
//       )
//       .subscribe();

//     return () => supabase.removeChannel(channel);
//   }, [callId]);

//   useEffect(() => {
//     (async () => {
//       const chatData = await ensureChat();
//       if (chatData) loadMessages(chatData.id);
//     })();
//   }, [ensureChat, loadMessages]);

//   return (
//     <div className="border p-2 w-full h-full flex flex-col">
//       <div className="flex-1 overflow-auto">
//         {messages.map((m) => (
//           <p key={m.id}>
//             <b>{m.senderId}:</b> {m.text}
//           </p>
//         ))}
//       </div>

//       <div className="flex gap-2">
//         <input
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Type message..."
//           className="border flex-1"
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// }