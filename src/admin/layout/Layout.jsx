import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { NotificationProvider } from "../../pos/context/NotificationContext";
import NotificationPanel from "../../pos/components/NotificationPanel";

export default function Layout({ children }) {
  return (
    <NotificationProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-8">{children}</main>
        </div>
      </div>
      <NotificationPanel />
    </NotificationProvider>
  );
}
