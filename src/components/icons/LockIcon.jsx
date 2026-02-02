function LockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M7 10V8a5 5 0 0110 0v2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M6.5 10h11A2.5 2.5 0 0120 12.5v6A2.5 2.5 0 0117.5 21h-11A2.5 2.5 0 014 18.5v-6A2.5 2.5 0 016.5 10z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default LockIcon;