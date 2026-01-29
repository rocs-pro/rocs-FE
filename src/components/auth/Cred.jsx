function Cred({ role, user }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-amber-900">{role}:</span>
      <span className="font-mono font-semibold text-amber-800">{user}</span>
    </div>
  );
}

export default Cred;