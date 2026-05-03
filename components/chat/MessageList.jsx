import MessageItem from "./MessageItem";

export default function MessageList({ messages, currentUserId }) {
  return (
    <div className="flex flex-col p-2 overflow-y-auto h-full">
      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}