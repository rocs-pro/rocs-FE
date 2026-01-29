function Feature({ icon, title, desc, iconBg }) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={`h-12 w-12 rounded-lg ring-1 flex items-center justify-center flex-shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <div>
        <div className="font-semibold text-white text-base">{title}</div>
        <div className="text-xs text-slate-400 mt-1">{desc}</div>
      </div>
    </div>
  );
}

export default Feature;