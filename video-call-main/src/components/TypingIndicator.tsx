export default function TypingIndicator({ show }: { show: boolean }) {
  if (!show) return null;
  return <p>Someone is typing...</p>;
}
