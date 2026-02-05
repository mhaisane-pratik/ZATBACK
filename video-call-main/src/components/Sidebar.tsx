export default function Sidebar({ username }: any) {
  return (
    <div style={{ padding: 10, background: "#eee" }}>
      Logged in as <b>{username}</b>
    </div>
  );
}
