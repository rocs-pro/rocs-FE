import React, { useState, useEffect } from 'react';
import { RotateCcw, X, Search, Clock, CornerUpLeft } from 'lucide-react';
import { posService } from '../../services/posService'; // Import Service

export default function ListModal({ type, onClose, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]); // Fetch Data
  
  const title = type === 'RECALL' ? 'Recall Bill' : 'Return Bill';
  const Icon = type === 'RECALL' ? RotateCcw : CornerUpLeft;

  useEffect(() => {
    // API Call: Fetch bills based on type
    const status = type === 'RECALL' ? 'HELD' : 'COMPLETED';
    posService.getBills(status)
        .then(res => setData(res.data))
        .catch(err => console.error(err));
  }, [type]);

  const filteredData = data.filter(item => item.id.toLowerCase().includes(searchTerm.toLowerCase()));
}
