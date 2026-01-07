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
  const handleLogin = async (cashierName, amount, supervisorCreds) => {
      try {
          // Send Cashier + Float + Supervisor Creds to Backend
          const payload = {
              cashier: cashierName, 
              float: amount,
              supervisor: supervisorCreds // { username: '...', password: '...' }
          };
          
          const res = await posService.openShift(payload);
          setSession({ isOpen: true, cashier: cashierName, shiftId: res.data.shiftId });
          setActiveModal(null);
      } catch (err) {
          // The backend should return 401/403 if supervisor password is wrong
          alert("Login Failed: Supervisor credentials incorrect or server error.");
      }
  };

  // 2. LOGOUT (Close Shift)
  const handleLogout = async (closingAmount, supervisorCreds) => {
      try {
          // Send Closing Info + Supervisor Creds
          const payload = { 
              shiftId: session.shiftId, 
              amount: closingAmount,
              supervisor: supervisorCreds 
          };

          await posService.closeShift(payload);
          
          showAlert("Shift Closed", `Cashier: ${session.cashier}\nSystem Closed.`, () => {
             window.location.reload();
          });
      } catch (err) {
          alert("Error Closing Shift: Supervisor credentials incorrect or server error.");
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

  // 4. PAYMENTS
  const handlePayment = async (type) => {
      if(cart.length === 0) return;
      
      const orderData = {
          items: cart,
          total: cart.reduce((a,c)=>a+c.price*c.qty,0),
          customer: customer ? customer.id : null,
          paymentMethod: type,
          shiftId: session.shiftId
      };

      try {
          await posService.submitOrder(orderData);
          showAlert("Payment Successful", `Method: ${type === 'PAY_CASH' ? 'CASH' : 'CARD'}\nAmount: ${orderData.total.toFixed(2)}`, () => {
              setCart([]);
              setCustomer(null);
          });
      } catch (err) {
          showAlert("Payment Failed", "Could not process transaction.");
      }
  }

  // 5. VOID / HOLD / RECALL
  const handleVoidItem = (index) => {
    const item = cart[index];
    showConfirm("Void Item", `Remove "${item.name}"?`, () => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
        setActiveModal(null);
    });
  };

  const handleComplexAction = (action) => {
      if(action === 'HOLD') {
          if(cart.length === 0) return;
          showConfirm("Suspend Transaction", "Park this transaction?", () => {
              // API: Send to Hold status
              setCart([]);
              setCustomer(null);
              setActiveModal(null);
          });
      } 
      else if (action === 'CANCEL') {
          if(cart.length === 0) return;
          showConfirm("Cancel Transaction", "Void entire bill?", () => {
              setCart([]);
              setCustomer(null);
              setActiveModal(null);
          });
      }
      else if (action === 'RECALL') {
          showConfirm("Recall Bill", "Open Held Bills list?", () => {
              setListConfig({ type: 'RECALL' });
              setActiveModal('LIST'); 
          });
      }
      else if (action === 'RETURN') {
          showConfirm("Return Bill", "Enter Return mode?", () => {
              setListConfig({ type: 'RETURN' });
              setActiveModal('LIST'); 
          });
      }
      else if (action === 'EXIT') {
          setActiveModal('END_SHIFT');
      }
      else if (action === 'PAY_CASH' || action === 'PAY_CARD') {
          handlePayment(action);
      }
  };

  // KEYBOARD
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeModal && activeModal !== 'FLOAT') {
        if (e.key === 'Escape') {
            setActiveModal(null);
            setConfirmConfig(null);
        }
        return;
      }
      if (e.key === 'F1') { e.preventDefault(); setActiveModal('PRICE_CHECK'); }
      if (e.key === 'F3') { e.preventDefault(); handleComplexAction('RECALL'); }
      if (e.key === 'F4') { e.preventDefault(); handleComplexAction('CANCEL'); }
      if (e.key === 'F6') { e.preventDefault(); setActiveModal('PAID_IN'); }
      if (e.key === 'F7') { e.preventDefault(); setActiveModal('PAID_OUT'); }
      if (!activeModal && document.activeElement.tagName !== 'INPUT') {
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden font-sans relative">
        {/* HEADER */}
        <header className="bg-slate-900 text-white h-14 shrink-0 flex items-center justify-between px-4 shadow-md z-30">
            <div className="flex items-center gap-4">
                <div className="flex flex-col leading-none">
                    <span className="font-bold text-lg text-green-400">POS-01</span>
                    <span className="text-[10px] text-slate-400 uppercase font-medium">Colombo Main</span>
                </div>
            </div>
            <div className="flex items-center gap-5">
                <div className="flex items-center gap-2 bg-blue-900/40 border border-blue-800 px-4 py-1.5 rounded-full">
                    <User className="w-4 h-4 text-blue-300" />
                    <span className="text-sm font-bold text-white uppercase tracking-wide">{session.cashier}</span>
                </div>
                <div className="text-right leading-tight">
                    <div className="font-mono text-xl font-bold text-white">{time.toLocaleTimeString()}</div>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
                <button onClick={() => handleComplexAction('EXIT')} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide border border-red-800">Exit</button>
            </div>
        </header>

        {/* WORKSPACE */}
        <div className={`flex flex-1 overflow-hidden transition-all duration-500 ${!session.isOpen || activeModal ? 'blur-[3px] brightness-90' : ''}`}>
            <BillPanel cart={cart} customer={customer} onRemoveItem={handleVoidItem} onDetachCustomer={() => setCustomer(null)}/>
            <ControlPanel inputRef={inputRef} inputBuffer={inputBuffer} setInputBuffer={setInputBuffer} onScan={handleScan} onOpenModal={setActiveModal} onAction={handleComplexAction} onVoid={() => handleVoidItem(cart.length - 1)} isEnabled={session.isOpen}/>
            <ProductGrid onAddToCart={handleAddToCart}/>
        </div>

        {/* MODALS */}
        {activeModal === 'FLOAT' && <FloatModal onApprove={handleLogin} />}
        {activeModal === 'END_SHIFT' && <EndShiftModal cashierName={session.cashier} onClose={() => setActiveModal(null)} onConfirm={handleLogout} />}
        {activeModal === 'PRICE_CHECK' && <PriceCheckModal onClose={() => setActiveModal(null)} />}
        {activeModal === 'LOYALTY' && <LoyaltyModal onClose={() => setActiveModal(null)} onAttach={(c) => { setCustomer(c); setActiveModal(null); }} />}
        {activeModal === 'PAID_IN' && <IOModal type="PAID_IN" onClose={() => setActiveModal(null)} />}
        {activeModal === 'PAID_OUT' && <IOModal type="PAID_OUT" onClose={() => setActiveModal(null)} />}
        {activeModal === 'REGISTER' && <RegisterModal onClose={() => setActiveModal(null)} />}
        {activeModal === 'CONFIRM' && confirmConfig && <ConfirmModal title={confirmConfig.title} message={confirmConfig.message} onConfirm={confirmConfig.onYes} onCancel={() => setActiveModal(null)} isAlert={confirmConfig.isAlert} />}
        
        {activeModal === 'LIST' && listConfig && (
            <ListModal 
                type={listConfig.type} 
                onClose={() => setActiveModal(null)} 
                onSelect={async (item) => { 
                    try {
                        // API: Fetch Full Bill Details
                        const res = await posService.getBillById(item.id);
                        setListConfig(null); 
                        showAlert("Success", `Bill #${item.id} loaded.`);
                        // Here you would typically setCart(res.data.items)
                    } catch(e) { alert("Error loading bill"); }
                }} 
            />
        )}
    </div>
  );

}