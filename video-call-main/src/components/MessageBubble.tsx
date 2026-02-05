export default function MessageBubble({ msg, me }: any) {
  return (
    <div
      style={{
        textAlign: me ? "right" : "left",
        margin: "5px 0",
      }}
    >
      <span>{msg.message_text}</span>
      {me && msg.seen && " ✔✔"}
    </div>
  );
}
