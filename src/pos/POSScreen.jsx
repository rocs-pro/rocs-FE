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

  // --- ALERTS ---
  const showAlert = (title, message, onOk = () => {}) => {
      setConfirmConfig({ title, message, onYes: () => { onOk(); setActiveModal(null); }, isAlert: true });
      setActiveModal('CONFIRM');
  };

  const showConfirm = (title, message, onYes) => {
      setConfirmConfig({ title, message, onYes: onYes, isAlert: false });
      setActiveModal('CONFIRM');
  };
}