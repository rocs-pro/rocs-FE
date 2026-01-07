import React, { useEffect, useRef } from 'react';

export default function IOModal({ type, onClose }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${type === 'PAID_IN' ? 'Paid In' : 'Paid Out'} Recorded Successfully!`);
    onClose();
  };

}