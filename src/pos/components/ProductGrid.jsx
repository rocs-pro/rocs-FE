import React, { useEffect, useState } from 'react';
import { Zap, Package } from 'lucide-react';
import { posService } from '../../services/posService'; // Import Service

export default function ProductGrid({ onAddToCart }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // API Fetch
    posService.getQuickItems()
        .then(res => setItems(res.data))
        .catch(err => console.error("Failed to load quick items", err));
  }, []);
  
}