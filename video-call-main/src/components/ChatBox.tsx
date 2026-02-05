import MessageBubble from "./MessageBubble";

export default function ChatBox({ messages, user }: any) {
  return (
    <div style={{ height: 300, overflowY: "auto" }}>
      {messages.map((m: any) => (
        <MessageBubble
          key={m.id}
          msg={m}
          me={m.user_id === user.id}
        />
      ))}
    </div>
  );
}
