import React, { useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react';
import BillPanel from './components/BillPanel';
import ControlPanel from './components/ControlPanel';
import ProductGrid from './components/ProductGrid';
import { posService } from '../services/posService'; // IMPORT SERVICE

// MODALS
import PriceCheckModal from './modals/PriceCheckModal';
import LoyaltyModal from './modals/LoyaltyModal';
import IOModal from './modals/IOModal';
import RegisterModal from './modals/RegisterModal';
import ConfirmModal from './modals/ConfirmModal';
import ListModal from './modals/ListModal';
import FloatModal from './modals/FloatModal'; 
import EndShiftModal from './modals/EndShiftModal';

export default function POSScreen() {
  const [session, setSession] = useState({ isOpen: false, cashier: "--", shiftId: null });
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [inputBuffer, setInputBuffer] = useState("");
  
  const [activeModal, setActiveModal] = useState('FLOAT'); 
  const [confirmConfig, setConfirmConfig] = useState(null);
  const [listConfig, setListConfig] = useState(null); 

  const [time, setTime] = useState(new Date());
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  //ALERTS
  const showAlert = (title, message, onOk = () => {}) => {
      setConfirmConfig({ title, message, onYes: () => { onOk(); setActiveModal(null); }, isAlert: true });
      setActiveModal('CONFIRM');
  };

  const showConfirm = (title, message, onYes) => {
      setConfirmConfig({ title, message, onYes: onYes, isAlert: false });
      setActiveModal('CONFIRM');
  };

  //API ACTIONS
  
  // 1. LOGIN (Start Shift)
  const handleLogin = async (cashierName, amount) => {
      try {
          // API CALL: Open Shift
          const res = await posService.openShift({ cashier: cashierName, float: amount });
          setSession({ isOpen: true, cashier: cashierName, shiftId: res.data.shiftId });
          setActiveModal(null);
      } catch (err) {
          alert("Login Failed: " + err.message);
      }
  };

  // 2. LOGOUT (Close Shift)
  const handleLogout = async (closingAmount) => {
      try {
          await posService.closeShift({ shiftId: session.shiftId, amount: closingAmount });
          showAlert("Shift Closed", `Cashier: ${session.cashier}\nSystem Closed.`, () => {
             window.location.reload();
          });
      } catch (err) {
          alert("Error Closing Shift: " + err.message);
      }
  };

  // 3. ADD ITEM (Scan)
  const handleAddToCart = async (productId) => {
    try {
        // API CALL: Get Product
        const res = await posService.getProduct(productId);
        const product = res.data; // Expecting { id, name, price }

        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, { ...product, qty: 1 }];
        });
    } catch (err) {
        showAlert("Product Not Found", `Item code '${productId}' invalid.`);
    }
  };

  const handleScan = () => {
    if (!inputBuffer) return;
    handleAddToCart(inputBuffer);
    setInputBuffer("");
    inputRef.current?.focus();
  };

}