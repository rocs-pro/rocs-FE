import { useNavigate } from "react-router-dom";
import { quickActions } from "../data/managerMockData";

export default function QuickActionsPanel() {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
      <div className="font-bold mb-3">Quick Actions</div>
      <div className="space-y-3">
        {quickActions.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => navigate(a.to)}
            className="w-full py-2 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold transition"
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
