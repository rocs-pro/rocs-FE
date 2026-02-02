import { useEffect, useState } from "react";

export default function Clock({ timeZone = "Asia/Colombo" }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("en-LK", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
return (
  <span className="inline-flex items-center gap-2 text-xs leading-none px-3 py-2 rounded-full bg-blue-50 border border-blue-200">
    <span className="text-blue-600">🕒</span>
    <span className="font-semibold tabular-nums tracking-wide text-blue-900">
      {time}
    </span>
  </span>
);
}
