import { useNavigate } from "react-router-dom";

const ActionButton = ({ label, onClick, color = "brand" }) => {
  const colorClasses = {
    brand: "bg-brand-primary hover:bg-brand-secondary text-white",
    green: "bg-green-600 hover:bg-green-700 text-white",
    amber: "bg-amber-500 hover:bg-amber-600 text-white",
    purple: "bg-purple-600 hover:bg-purple-700 text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center p-4 rounded-xl ${colorClasses[color]} font-medium transition-all hover:shadow-lg hover:-translate-y-0.5 text-center`}
    >
      {label}
    </button>
  );
};

export default function AdminQuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
          <p className="text-sm text-gray-500">Admin control panel shortcuts</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ActionButton
          label="Manage Users"
          onClick={() => navigate("/admin/users")}
          color="brand"
        />
        <ActionButton
          label="Manage Branches"
          onClick={() => navigate("/admin/branches")}
          color="green"
        />
        <ActionButton
          label="Terminals"
          onClick={() => navigate("/admin/terminals")}
          color="amber"
        />
        <ActionButton
          label="Reports"
          onClick={() => navigate("/admin/reports")}
          color="purple"
        />
      </div>
    </div>
  );
}
