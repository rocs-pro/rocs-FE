import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, LogOut, Bell, Store } from 'lucide-react';
import BillPanel from './components/BillPanel';
import ControlPanel from './components/ControlPanel';
import ProductGrid from './components/ProductGrid';
import { posService } from '../services/posService'; 
import { authService } from '../services/authService';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import NotificationPanel from './components/NotificationPanel';

// Modals
import PriceCheckModal from './modals/PriceCheckModal';
import LoyaltyModal from './modals/LoyaltyModal';
import IOModal from './modals/IOModal';
import RegisterModal from './modals/RegisterModal';
import ConfirmModal from './modals/ConfirmModal';
import ListModal from './modals/ListModal';
import FloatModal from './modals/FloatModal'; 
import EndShiftModal from './modals/EndShiftModal';
import PaymentModal from './modals/PaymentModal';
import QuantityModal from './modals/QuantityModal'; 
import QuickAddModal from './modals/QuickAddModal'; 

// Get branch/terminal from localStorage or use defaults
const getBranchId = () => {
    const user = localStorage.getItem('user');
    if (user) {
        const parsed = JSON.parse(user);
        return parsed.branchId || 1;
    }
    return 1;
};

const TERMINAL_ID = 1; // Can be made dynamic if needed

function POSContent() {
  const [branchId] = useState(getBranchId());
  const [session, setSession] = useState({ 
      isOpen: false, 
      cashier: "--", 
      shiftId: null, 
      userId: null,
      terminalCode: `POS-${String(TERMINAL_ID).padStart(2, '0')}`
  });
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [inputBuffer, setInputBuffer] = useState("");
  const [invoiceId, setInvoiceId] = useState("INV-READY"); 
  const [nextInvoiceNo, setNextInvoiceNo] = useState(1); // Track next invoice number
  const [shiftTotals, setShiftTotals] = useState(null);
  const [branchInfo, setBranchInfo] = useState({ name: "Loading...", code: "" });

  const [activeModal, setActiveModal] = useState('FLOAT'); 
  const [confirmConfig, setConfirmConfig] = useState(null);
  const [listConfig, setListConfig] = useState(null); 
  
  const [selectedCartIndex, setSelectedCartIndex] = useState(null);
  const [quickGridRefresh, setQuickGridRefresh] = useState(0);
  const [time, setTime] = useState(new Date());
  
  const inputRef = useRef(null);
  const { addNotification, setIsOpen, unreadCount } = useNotification();

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate invoice ID using next sequential number when cart has items
  useEffect(() => {
    if (cart.length > 0 && session.isOpen) {
        if (invoiceId === 'INV-READY' || invoiceId === 'INV-PENDING') {
            // Format: INV-YYYYMMDD-XXXXX (e.g., INV-20260202-00001)
            const today = new Date();
            const datePart = today.getFullYear().toString() +
                String(today.getMonth() + 1).padStart(2, '0') +
                String(today.getDate()).padStart(2, '0');
            const numPart = String(nextInvoiceNo).padStart(5, '0');
            setInvoiceId(`INV-${datePart}-${numPart}`);
        }
    } 
  }, [cart.length, session.isOpen, nextInvoiceNo]);

  // Block refresh while shift is open
  useEffect(() => {
    const handleKeyDownBlocker = (e) => {
        if (!session.isOpen) return; 
        if (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && e.key === 'r')) {
            e.preventDefault();
            addNotification('warning', 'Action Blocked', 'Refreshing is disabled while the shift is open.');
        }
    };
    const handleBeforeUnload = (e) => {
        if (!session.isOpen) return;
        e.preventDefault();
        e.returnValue = ''; 
        return '';
    };
    window.addEventListener('keydown', handleKeyDownBlocker);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
        window.removeEventListener('keydown', handleKeyDownBlocker);
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [session.isOpen, addNotification]); 

  // --- HANDLER: OPEN SHIFT ---
  const handleLogin = async (cashierObj, amount, supervisorCreds, denominations = null) => {
      try {
          // 1. First verify the supervisor credentials and check their role
          const authRes = await authService.login({ 
              username: supervisorCreds.username, 
              password: supervisorCreds.password 
          });
          const approver = authRes.data || authRes;
          
          console.log("Supervisor Auth Response:", approver);

          // 2. Check if the approver has permission to approve shifts
          const allowedRoles = ['ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR'];
          const approverRole = (approver.role || approver.userRole || "").toUpperCase();

          if (!allowedRoles.includes(approverRole)) {
              addNotification('error', 'Access Denied', 
                  `User '${approver.username || supervisorCreds.username}' is a ${approverRole || 'CASHIER'} and cannot approve shifts. Only Admin, Branch Manager, or Supervisor can approve.`);
              throw new Error("Insufficient Permissions"); 
          }

          // 3. Prepare Payload matching cash_shifts table structure
          const payload = { 
              cashierId: cashierObj.id, 
              branchId: branchId, 
              terminalId: TERMINAL_ID, 
              openingCash: parseFloat(amount),
              // Supervisor credentials for backend verification
              supervisorUsername: supervisorCreds.username,
              supervisorPassword: supervisorCreds.password,
              approvedBy: approver.userId || approver.id // The supervisor's user ID
          };
          
          // Add denominations if provided
          if (denominations && denominations.length > 0) {
              payload.denominations = denominations;
          }
          
          // Debug: Log payload to help identify issues
          console.log("Opening Shift - Payload:", JSON.stringify(payload, null, 2));
          
          // 4. Call Backend to open shift
          const res = await posService.openShift(payload);
          const data = res.data?.data || res.data;
          
          console.log("Shift Open Response:", data);
          
          let theShiftId = null;
          let shiftNo = null;
          if (typeof data === 'number') {
              theShiftId = data;
          } else if (data && typeof data === 'object') {
              theShiftId = data.shiftId || data.id || data.shift_id;
              shiftNo = data.shiftNo || data.shift_no;
          }

          if (!theShiftId) throw new Error("Invalid Shift ID received.");

          setSession({ 
              isOpen: true, 
              cashier: cashierObj.name, 
              shiftId: theShiftId,
              shiftNo: shiftNo || `SH-${theShiftId}`,
              userId: cashierObj.id,
              terminalCode: `POS-${String(TERMINAL_ID).padStart(2, '0')}`
          });
          
          // 5. Fetch last invoice number to generate next one
          try {
              const invoiceRes = await posService.getLastInvoiceNumber(branchId);
              const lastInvoice = invoiceRes.data?.data || invoiceRes.data;
              let lastNum = 0;
              
              if (lastInvoice) {
                  // Parse last invoice number (e.g., "INV-20260202-00015" -> 15)
                  if (typeof lastInvoice === 'number') {
                      lastNum = lastInvoice;
                  } else if (typeof lastInvoice === 'string') {
                      const match = lastInvoice.match(/(\d+)$/);
                      lastNum = match ? parseInt(match[1]) : 0;
                  } else if (lastInvoice.invoiceNo) {
                      const match = lastInvoice.invoiceNo.match(/(\d+)$/);
                      lastNum = match ? parseInt(match[1]) : 0;
                  } else if (lastInvoice.lastNumber !== undefined) {
                      lastNum = lastInvoice.lastNumber;
                  }
              }
              
              setNextInvoiceNo(lastNum + 1);
              console.log("Next Invoice Number:", lastNum + 1);
          } catch (invErr) {
              console.warn("Could not fetch last invoice number, starting from 1:", invErr);
              setNextInvoiceNo(1);
          }
          
          setActiveModal(null);
          addNotification('success', 'Terminal Open', `Shift #${theShiftId} started successfully. Approved by ${approver.username || supervisorCreds.username}.`);
      } catch (err) {
          console.error("Shift Open Error:", err);
          console.error("Error Response:", err.response?.data);
          
          if (err.message === "Insufficient Permissions") {
              // Notification already shown above
          } else if (err.response?.status === 401 || err.response?.status === 403) {
              addNotification('error', 'Verification Failed', 'Invalid Supervisor Username or Password.');
          } else if (err.response?.status === 400) {
              const msg = err.response?.data?.message || err.response?.data?.error || 'Invalid request data';
              addNotification('error', 'Validation Error', msg);
          } else {
              const msg = err.response?.data?.message || err.message || 'Failed to open shift';
              addNotification('error', 'Login Error', msg);
          }
          throw err; 
      }
  };

  // --- HANDLER: CLOSE SHIFT ---
  const handleLogout = async (closingAmount, supervisorCreds, denominations = null) => {
      try {
          await posService.closeShift(session.shiftId, {
              closingCash: parseFloat(closingAmount),
              denominations: denominations,
              notes: "Shift Closed",
              supervisorUsername: supervisorCreds.username,
              supervisorPassword: supervisorCreds.password
          });
          setSession({ 
              isOpen: false, 
              cashier: "--", 
              shiftId: null, 
              userId: null,
              terminalCode: `POS-${String(TERMINAL_ID).padStart(2, '0')}`
          }); 
          addNotification('success', 'Shift Closed', 'System shutting down...');
          setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
          const msg = err.response?.data?.message || err.message || 'Logout failed';
          addNotification('error', 'Logout Error', msg);
          throw new Error(msg);
      }
  };

  // --- HANDLER: ADD PRODUCT TO CART ---
  // Can accept either a product code (string) or a product object
  const handleAddToCart = async (productInput) => {
    if (!productInput) return;
    
    try {
        let product;
        
        // If productInput is already a product object (from quick pick)
        if (typeof productInput === 'object' && productInput !== null) {
            product = {
                id: productInput.productId || productInput.id,
                name: productInput.name || productInput.productName,
                price: parseFloat(productInput.sellingPrice || productInput.price || 0),
                costPrice: parseFloat(productInput.costPrice || 0),
                sku: productInput.sku,
                barcode: productInput.barcode,
                taxRate: parseFloat(productInput.taxRate || 0),
                qty: 1,
                discount: 0
            };
        } else {
            // productInput is a code - fetch from API
            const productCode = String(productInput).trim();
            if (!productCode) return;
            
            console.log("Scanning product code:", productCode);
            
            const res = await posService.getProduct(productCode);
            // getProduct now returns { data: product } after trying multiple endpoints
            const rawData = res.data?.data || res.data; 
            
            console.log("Product API response:", rawData);

            if (!rawData) {
                throw new Error("Product not found");
            }

            // Map product data matching products table structure
            product = {
                id: rawData.productId || rawData.id,
                name: rawData.name || rawData.productName,
                price: parseFloat(rawData.sellingPrice ?? rawData.price ?? rawData.unitPrice ?? 0),
                costPrice: parseFloat(rawData.costPrice || 0),
                sku: rawData.sku,
                barcode: rawData.barcode,
                taxRate: parseFloat(rawData.taxRate || 0),
                qty: 1,
                discount: 0
            };
        }
        
        if (!product.id && !product.sku && !product.barcode) {
            throw new Error("Invalid product data - no identifier");
        }
        
        if (!product.name) {
            throw new Error("Invalid product data - no name");
        }
        
        // Use barcode/sku as ID if id is missing
        if (!product.id) {
            product.id = product.sku || product.barcode;
        }
        
        setCart(prev => {
            const existingIndex = prev.findIndex(item => 
                item.id === product.id || 
                (item.barcode && item.barcode === product.barcode) ||
                (item.sku && item.sku === product.sku)
            );
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = { 
                    ...updated[existingIndex], 
                    qty: updated[existingIndex].qty + 1 
                };
                addNotification('info', 'Quantity Updated', `${product.name} x${updated[existingIndex].qty}`);
                return updated;
            }
            addNotification('success', 'Item Added', `${product.name} added to cart`);
            return [...prev, product];
        });
        
        inputRef.current?.focus();
    } catch (err) {
        console.error("Add to cart error:", err);
        const code = typeof productInput === 'object' ? (productInput?.sku || productInput?.barcode) : productInput;
        addNotification('error', 'Product Not Found', `Code '${code}' is invalid or not available.`);
    }
  };

  const handleScan = () => {
    if (!inputBuffer.trim()) return;
    handleAddToCart(inputBuffer.trim());
    setInputBuffer("");
    inputRef.current?.focus();
  };

  const openPaymentModal = (mode = 'CASH') => {
      if(cart.length === 0) {
          addNotification('warning', 'Empty Cart', 'Add items first.');
          return;
      }
      if(!session.shiftId) {
          addNotification('error', 'System Error', 'No Active Shift.');
          return;
      }
      setListConfig({ mode }); 
      setActiveModal('PAYMENT');
  };

  // --- HANDLER: PROCESS PAYMENT ---
  // Matches sales, sale_items, payments tables
  const processPayment = async (paymentDetails) => {
      // Calculate totals
      const grossTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const totalDiscount = cart.reduce((sum, item) => sum + (item.discount || 0), 0);
      const taxAmount = cart.reduce((sum, item) => {
          const itemTotal = (item.price * item.qty) - (item.discount || 0);
          return sum + (itemTotal * (item.taxRate || 0) / 100);
      }, 0);
      const netTotal = grossTotal - totalDiscount + taxAmount;

      // Map cart items to sale_items table structure
      const mappedItems = cart.map(item => ({
          productId: item.id,
          serialId: item.serialId || null,
          qty: item.qty,      
          unitPrice: item.price,   
          discount: item.discount || 0,
          taxRate: item.taxRate || 0
      }));

      // Map payments to payments table structure
      const paymentList = paymentDetails.payments.map(p => ({
          paymentType: p.paymentType,
          amount: p.amount, 
          referenceNo: p.referenceNo || null,
          bankName: p.bankName || null,
          cardLast4: p.cardLast4 || null
      }));

      // Build order data matching sales table structure
      const orderData = {
          branchId: branchId,
          cashierId: session.userId,
          customerId: customer ? customer.customerId || customer.id : null,
          shiftId: session.shiftId,
          grossTotal: grossTotal,
          discount: totalDiscount,
          taxAmount: taxAmount,
          netTotal: netTotal,
          paidAmount: paymentDetails.totalPaid,
          changeAmount: paymentDetails.changeAmount || 0,
          saleType: "RETAIL",
          notes: "",
          items: mappedItems,
          payments: paymentList
      };

      try {
          const res = await posService.submitOrder(orderData);
          const data = res.data?.data || res.data;
          const finalInvoiceId = data?.invoiceNo || data?.invoice_no || invoiceId;
          
          setInvoiceId(finalInvoiceId); 
          addNotification('success', 'Sale Complete', `Invoice: ${finalInvoiceId} | Change: LKR ${paymentDetails.changeAmount?.toFixed(2) || '0.00'}`);
          
          // Increment invoice number for next sale
          setNextInvoiceNo(prev => prev + 1);
          
          // Update customer loyalty points if applicable
          if (customer && customer.id) {
              const pointsEarned = Math.floor(netTotal / 100); // 1 point per 100 spent
              if (pointsEarned > 0) {
                  try {
                      await posService.updateLoyaltyPoints(customer.id, pointsEarned);
                      addNotification('info', 'Loyalty Points', `${pointsEarned} points added to ${customer.name}`);
                  } catch (e) {
                      console.error("Failed to update loyalty points", e);
                  }
              }
          }
          
          // Reset cart and close modal
          setCart([]);
          setCustomer(null);
          setActiveModal(null);
          
          // Reset invoice display after 3 seconds, ready for next sale
          setTimeout(() => { setInvoiceId("INV-READY"); }, 3000);
      } catch (err) {
          const msg = err.response?.data?.message || err.response?.data?.error || "Transaction failed";
          addNotification('error', 'Payment Failed', msg);
      }
  };

  const handleCartItemClick = (index) => { 
      setSelectedCartIndex(index); 
      setActiveModal('QUANTITY'); 
  };
  
  const handleQuantityUpdate = (newQty) => {
      if (selectedCartIndex !== null && newQty > 0) {
          setCart(prev => {
              const newCart = [...prev];
              newCart[selectedCartIndex] = { ...newCart[selectedCartIndex], qty: newQty };
              return newCart;
          });
      }
      setActiveModal(null);
      setSelectedCartIndex(null);
  };
  
  const handleVoidItem = (index) => {
    const targetIndex = index !== undefined ? index : cart.length - 1;
    if(targetIndex < 0 || targetIndex >= cart.length) return;
    const item = cart[targetIndex];
    showConfirm("Void Item", `Remove "${item.name}" from cart?`, () => {
        const newCart = [...cart];
        newCart.splice(targetIndex, 1);
        setCart(newCart);
        setActiveModal(null);
        addNotification('info', 'Item Voided', `${item.name} removed from cart.`);
    });
  };
  
  // Apply discount to selected item
  const handleApplyItemDiscount = (index, discountAmount) => {
      if (index < 0 || index >= cart.length) return;
      setCart(prev => {
          const newCart = [...prev];
          newCart[index] = { ...newCart[index], discount: discountAmount };
          return newCart;
      });
      addNotification('success', 'Discount Applied', `LKR ${discountAmount.toFixed(2)} discount applied.`);
  };

  const showConfirm = (title, message, onYes, isAlert = false) => {
      setConfirmConfig({ title, message, onYes, isAlert });
      setActiveModal('CONFIRM');
  };

  const handleComplexAction = async (action) => {
      if(action === 'HOLD') {
          if(cart.length === 0) return;
          showConfirm("Suspend Transaction", "Park this transaction for later?", async () => {
              try {
                  await posService.holdBill({
                      branchId: branchId,
                      shiftId: session.shiftId,
                      customerId: customer?.id || null,
                      items: cart.map(item => ({
                          productId: item.id,
                          qty: item.qty,
                          unitPrice: item.price,
                          discount: item.discount || 0
                      }))
                  });
                  setCart([]); 
                  setCustomer(null); 
                  setActiveModal(null);
                  setInvoiceId("INV-READY");
                  addNotification('info', 'Bill Held', 'Transaction parked successfully.');
              } catch (err) {
                  addNotification('error', 'Hold Failed', err.response?.data?.message || 'Could not hold bill.');
              }
          });
      } 
      else if (action === 'CANCEL') {
          if(cart.length === 0) return;
          showConfirm("Cancel Transaction", "Void the entire bill?", () => {
              setCart([]); 
              setCustomer(null); 
              setActiveModal(null);
              setInvoiceId("INV-READY"); 
              addNotification('warning', 'Bill Cancelled', 'Transaction cleared.');
          });
      }
      else if (action === 'RECALL') {
          setListConfig({ type: 'RECALL' }); 
          setActiveModal('LIST');
      }
      else if (action === 'RETURN') {
          setListConfig({ type: 'RETURN' }); 
          setActiveModal('LIST');
      }
      else if (action === 'EXIT') {
          if (cart.length > 0) {
              showConfirm("Pending Items", "You have items in cart. Cancel them before closing shift.", null, true);
              return;
          }
          setShiftTotals(null); 
          setActiveModal('END_SHIFT');
          try {
             if(session.shiftId) {
                 const res = await posService.getShiftTotals(session.shiftId);
                 setShiftTotals(res.data?.data || res.data);
             }
          } catch(e) { 
              console.error("Failed to fetch shift totals:", e); 
          }
      }
      else if (action === 'PAY_CASH') { openPaymentModal('CASH'); }
      else if (action === 'PAY_CARD') { openPaymentModal('CARD'); }
      else if (action === 'PAY_QR') { openPaymentModal('QR'); }
  };

  // Handle recalled bill
  const handleRecallBill = async (bill) => {
      try {
          const res = await posService.recallBill(bill.saleId || bill.id);
          const data = res.data?.data || res.data;
          
          // Populate cart with recalled items
          if (data.items && Array.isArray(data.items)) {
              const recalledCart = data.items.map(item => ({
                  id: item.productId,
                  name: item.productName || item.name,
                  price: item.unitPrice,
                  qty: item.qty,
                  discount: item.discount || 0,
                  taxRate: item.taxRate || 0
              }));
              setCart(recalledCart);
          }
          
          // Set customer if exists
          if (data.customer) {
              setCustomer(data.customer);
          }
          
          setListConfig(null);
          setActiveModal(null);
          addNotification('success', 'Bill Recalled', `Bill #${bill.invoiceNo || bill.id} loaded.`);
      } catch(e) { 
          addNotification('error', 'Recall Failed', e.response?.data?.message || 'Failed to load bill.'); 
      }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeModal && activeModal !== 'FLOAT') {
        if (e.key === 'Escape') { setActiveModal(null); setConfirmConfig(null); }
        return;
      }
      if (!session.isOpen) return;
      
      if (e.key === 'F1') { e.preventDefault(); setActiveModal('PRICE_CHECK'); }
      if (e.key === 'F3') { e.preventDefault(); handleComplexAction('RECALL'); }
      if (e.key === 'F4') { e.preventDefault(); handleComplexAction('CANCEL'); }
      if (e.key === 'F6') { e.preventDefault(); setActiveModal('PAID_IN'); }
      if (e.key === 'F7') { e.preventDefault(); setActiveModal('PAID_OUT'); }
      if (e.key === ' ' || e.code === 'Space') { 
          if (document.activeElement.tagName !== 'INPUT') {
              e.preventDefault(); 
              handleComplexAction('PAY_CASH'); 
          }
      }
      if (e.key === 'F10') { e.preventDefault(); handleComplexAction('PAY_CARD'); }
      if (e.key === 'F11') { e.preventDefault(); handleComplexAction('PAY_QR'); }
      if (e.key === 'Delete') { e.preventDefault(); handleVoidItem(); }

      if (!activeModal && document.activeElement.tagName !== 'INPUT') {
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, cart, session.isOpen]);

  // Calculate cart totals for display
  const cartTotals = React.useMemo(() => {
      const grossTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const totalDiscount = cart.reduce((sum, item) => sum + (item.discount || 0), 0);
      const taxAmount = cart.reduce((sum, item) => {
          const itemTotal = (item.price * item.qty) - (item.discount || 0);
          return sum + (itemTotal * (item.taxRate || 0) / 100);
      }, 0);
      const netTotal = grossTotal - totalDiscount + taxAmount;
      return { grossTotal, totalDiscount, taxAmount, netTotal, itemCount: cart.length };
  }, [cart]);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden font-sans relative">
        {/* HEADER */}
        <header className="bg-slate-900 text-white h-16 shrink-0 flex items-center justify-between px-4 shadow-md z-30 border-b border-slate-800">
            <div className="flex items-center gap-6">
                <div className="flex flex-col leading-none">
                    <span className="font-bold text-2xl text-green-400 tracking-tight">{session.terminalCode}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                        <Store className="w-3 h-3" /> {branchInfo.name || `Branch ${branchId}`}
                    </span>
                </div>
                <div className="h-8 w-px bg-slate-700"></div>
                <div className="bg-slate-800/50 px-4 py-1 rounded-md border border-slate-700 flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">INV:</span>
                    <span className="font-mono text-xl font-bold text-white tracking-widest">{invoiceId}</span>
                </div>
                {session.shiftId && (
                    <div className="bg-green-900/30 px-3 py-1 rounded border border-green-700/50">
                        <span className="text-[10px] text-green-400 uppercase font-bold">Shift #{session.shiftId}</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-6">
                <button onClick={() => setIsOpen(true)} className="relative p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>}
                </button>
                <div className="flex items-center gap-3 bg-blue-900/40 border border-blue-500/30 rounded-full py-1.5 px-4">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-bold tracking-wide uppercase text-blue-100">{session.cashier}</span>
                </div>
                <div className="text-right leading-tight hidden md:block">
                    <div className="font-mono text-2xl font-bold text-white tracking-widest">
                        {time.toLocaleTimeString('en-US', { hour12: false })}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
                    </div>
                </div>
                <button 
                    onClick={() => handleComplexAction('EXIT')} 
                    disabled={!session.isOpen}
                    className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest border border-red-800 disabled:border-slate-600 shadow-lg active:scale-95 transition-all w-auto"
                >
                    EXIT <LogOut className="w-4 h-4" />
                </button>
            </div>
        </header>

        {/* MAIN CONTENT */}
        <div className={`flex flex-1 overflow-hidden transition-all duration-500 ${!session.isOpen || activeModal ? 'blur-[3px] brightness-90' : ''}`}>
            <BillPanel 
                cart={cart} 
                customer={customer} 
                totals={cartTotals}
                onItemClick={handleCartItemClick} 
                onDetachCustomer={() => setCustomer(null)}
            />
            <ControlPanel 
                inputRef={inputRef} 
                inputBuffer={inputBuffer} 
                setInputBuffer={setInputBuffer} 
                onScan={handleScan} 
                onOpenModal={setActiveModal} 
                onAction={handleComplexAction} 
                onVoid={() => handleVoidItem()} 
                isEnabled={session.isOpen}
                onSelectProduct={handleAddToCart}
            />
            <ProductGrid 
                onAddToCart={handleAddToCart} 
                onAddQuickItemClick={() => setActiveModal('QUICK_ADD')} 
                refreshTrigger={quickGridRefresh}
                branchId={branchId}
            />
        </div>

        {/* NOTIFICATION PANEL */}
        <NotificationPanel />

        {/* MODALS */}
        {activeModal === 'FLOAT' && (
            <FloatModal 
                onApprove={handleLogin} 
                branchId={branchId} 
                terminalId={TERMINAL_ID} 
            />
        )}
        {activeModal === 'END_SHIFT' && (
            <EndShiftModal 
                cashierName={session.cashier} 
                shiftId={session.shiftId}
                expectedTotals={shiftTotals} 
                onClose={() => setActiveModal(null)} 
                onConfirm={handleLogout} 
            />
        )}
        {activeModal === 'PAYMENT' && (
            <PaymentModal 
                total={cartTotals.netTotal} 
                initialMethod={listConfig?.mode || 'CASH'} 
                onClose={() => setActiveModal(null)} 
                onProcess={processPayment} 
            />
        )}
        {activeModal === 'QUANTITY' && selectedCartIndex !== null && (
            <QuantityModal 
                item={cart[selectedCartIndex]} 
                onClose={() => { setActiveModal(null); setSelectedCartIndex(null); }} 
                onConfirm={handleQuantityUpdate}
                onVoid={() => handleVoidItem(selectedCartIndex)}
            />
        )}
        {activeModal === 'QUICK_ADD' && (
            <QuickAddModal 
                onClose={() => setActiveModal(null)} 
                onProductSelected={(item) => { 
                    handleAddToCart(item); 
                    setActiveModal(null); 
                }}
                onAddToQuickPick={(item) => {
                    // Add to quick pick items in localStorage
                    try {
                        const QUICK_ITEMS_KEY = 'pos_quick_pick_items';
                        const stored = localStorage.getItem(QUICK_ITEMS_KEY);
                        const items = stored ? JSON.parse(stored) : [];
                        
                        const newItem = {
                            id: item.productId || item.id,
                            sku: item.sku,
                            barcode: item.barcode,
                            name: item.name || item.productName,
                            price: parseFloat(item.sellingPrice || item.price || 0),
                            taxRate: parseFloat(item.taxRate || 0),
                            isActive: true
                        };
                        
                        const exists = items.some(p => p.id === newItem.id);
                        if (!exists) {
                            items.push(newItem);
                            localStorage.setItem(QUICK_ITEMS_KEY, JSON.stringify(items));
                            setQuickGridRefresh(prev => prev + 1); // Trigger refresh
                            addNotification('success', 'Added to Quick Pick', `${newItem.name} added to quick pick panel.`);
                            return true;
                        } else {
                            addNotification('info', 'Already Added', `${newItem.name} is already in quick pick.`);
                            return false;
                        }
                    } catch (e) {
                        console.error('Failed to add to quick pick:', e);
                        return false;
                    }
                }}
            />
        )}
        {activeModal === 'PAID_IN' && (
            <IOModal 
                type="PAID_IN" 
                shiftId={session.shiftId}
                onClose={() => setActiveModal(null)} 
                onNotify={addNotification} 
            />
        )}
        {activeModal === 'PAID_OUT' && (
            <IOModal 
                type="PAID_OUT" 
                shiftId={session.shiftId}
                onClose={() => setActiveModal(null)} 
                onNotify={addNotification} 
            />
        )}
        {activeModal === 'PRICE_CHECK' && (
            <PriceCheckModal onClose={() => setActiveModal(null)} />
        )}
        {activeModal === 'LOYALTY' && (
            <LoyaltyModal 
                onClose={() => setActiveModal(null)} 
                onAttach={(c) => { setCustomer(c); setActiveModal(null); }} 
            />
        )}
        {activeModal === 'REGISTER' && (
            <RegisterModal onClose={() => setActiveModal(null)} />
        )}
        {activeModal === 'CONFIRM' && confirmConfig && (
            <ConfirmModal 
                title={confirmConfig.title} 
                message={confirmConfig.message} 
                onConfirm={() => { 
                    if (confirmConfig.onYes) confirmConfig.onYes(); 
                    setActiveModal(null); 
                    setConfirmConfig(null);
                }} 
                onCancel={() => { setActiveModal(null); setConfirmConfig(null); }} 
                isAlert={confirmConfig.isAlert} 
            />
        )}
        {activeModal === 'LIST' && listConfig && (
            <ListModal 
                type={listConfig.type} 
                branchId={branchId}
                onClose={() => { setActiveModal(null); setListConfig(null); }} 
                onSelect={handleRecallBill} 
            />
        )}
    </div>
  );
}

export default function POSScreen() {
    return (
        <NotificationProvider>
            <POSContent />
        </NotificationProvider>
    );
}