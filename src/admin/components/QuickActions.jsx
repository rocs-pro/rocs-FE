import { useNavigate } from "react-router-dom";

const ActionBtn = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full mt-3 first:mt-0 py-2 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold transition"
  >
    {children}
  </button>
);

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
      <div className="font-bold mb-3">Overview • Quick Actions</div>

      <ActionBtn onClick={() => navigate("/admin/users")}>👤 User Registration</ActionBtn>
      <ActionBtn onClick={() => navigate("/admin/password-reset")}>🔑 Password Reset</ActionBtn>
      <ActionBtn onClick={() => navigate("/admin/branches")}>🏢 Manage Branches</ActionBtn>
      <ActionBtn onClick={() => navigate("/admin/system-activity")}>🧾 System Activity</ActionBtn>
    </div>
  );
}
