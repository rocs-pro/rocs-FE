import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { User, LogOut, Bell, Store, Receipt } from 'lucide-react';
import BillPanel from './components/BillPanel';
import ControlPanel from './components/ControlPanel';
import ProductGrid from './components/ProductGrid';
import { posService } from '../services/posService';
import { authService } from '../services/authService';
import { grnPaymentService } from '../services/grnPaymentService';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import NotificationPanel from './components/NotificationPanel';
import { getQuickItems, saveQuickItemsHelper } from '../shared/storage';

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
import QuickAddModal from './modals/QuickAddModal';
import CashierSummaryModal from './modals/CashierSummaryModal';
import ReturnModal from './modals/ReturnModal';
import SmartReturnModal from './modals/SmartReturnModal';
import DiscountModal from './modals/DiscountModal';
import GRNPaymentModal from './modals/GRNPaymentModal';

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

    const [activeModal, setActiveModal] = useState(null); // Wait for shift check before showing FLOAT
    const [confirmConfig, setConfirmConfig] = useState(null); // { title: "", message: "", onYes: () => {} }
    const [listConfig, setListConfig] = useState(null); // Settings for the ListModal
    const [returnSource, setReturnSource] = useState(null); // Invoice selected for return

    // Track active sale ID for updates (Held/Recall flow)
    const [currentSaleId, setCurrentSaleId] = useState(null);
    const [editingCartIndex, setEditingCartIndex] = useState(null);
    const [selectedCartIndex, setSelectedCartIndex] = useState(null);
    const [quickGridRefresh, setQuickGridRefresh] = useState(0);
    const [time, setTime] = useState(new Date());
    const [cashierSummary, setCashierSummary] = useState(null);
    const [cashierSummaryLoading, setCashierSummaryLoading] = useState(false);
    const [billDiscount, setBillDiscount] = useState(0); // Bill-level discount amount

    // GRN Payment Request state
    const [grnPaymentCount, setGrnPaymentCount] = useState(0);
    const [showGRNPaymentModal, setShowGRNPaymentModal] = useState(false);

    // Calculate cart totals including discounts
    const cartTotals = useMemo(() => {
        const grossTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const itemDiscountAmount = cart.reduce((sum, item) => sum + ((item.discount || 0) * item.qty), 0);
        const taxAmount = cart.reduce((sum, item) => {
            const itemTotal = (item.price * item.qty) - ((item.discount || 0) * item.qty);
            return sum + (itemTotal * (item.taxRate || 0) / 100);
        }, 0);
        const totalDiscount = itemDiscountAmount + billDiscount;
        const netTotal = grossTotal - totalDiscount + taxAmount;

        return {
            grossTotal,
            itemDiscountAmount,
            billDiscountAmount: billDiscount,
            discountAmount: totalDiscount,
            totalDiscount,
            taxAmount,
            netTotal,
            itemCount: cart.length,
            totalQty: cart.reduce((sum, item) => sum + item.qty, 0)
        };
    }, [cart, billDiscount]);

    // Helper to refresh shift totals
    const fetchShiftTotals = async () => {
        if (session.shiftId) {
            try {
                const res = await posService.getShiftTotals(session.shiftId);
                setShiftTotals(res.data?.data || res.data);
            } catch (e) {
                console.error("Failed to fetch shift totals:", e);
                addNotification('error', 'Sync Failed', 'Could not refresh shift totals.');
            }
        }
    };

    const inputRef = useRef(null);
    const { addNotification, setIsOpen, unreadCount } = useNotification();

    // Fetch branch info for header display
    useEffect(() => {
        let isMounted = true;

        authService.getBranches()
            .then((branches) => {
                if (!isMounted) return;

                const branch = branches?.find((b) =>
                    String(b.id ?? b.branchId) === String(branchId)
                );

                setBranchInfo({
                    name: branch?.name || branch?.branchName || `Branch ${branchId}`,
                    code: branch?.code || branch?.branchCode || ""
                });
            })
            .catch(() => {
                if (!isMounted) return;
                setBranchInfo({ name: `Branch ${branchId}`, code: "" });
            });

        return () => {
            isMounted = false;
        };
    }, [branchId]);

    // Clock
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch GRN Payment Request count
    useEffect(() => {
        const fetchGRNPaymentCount = async () => {
            try {
                const res = await grnPaymentService.getPendingCount(branchId);
                const count = res.data?.data?.count || 0;
                setGrnPaymentCount(count);
            } catch (err) {
                console.error('Failed to fetch GRN payment count:', err);
            }
        };

        fetchGRNPaymentCount();
        // Poll every 30 seconds
        const interval = setInterval(fetchGRNPaymentCount, 30000);
        return () => clearInterval(interval);
    }, [branchId]);

    useEffect(() => {
        if (selectedCartIndex === null || selectedCartIndex === undefined) return;
        if (selectedCartIndex < 0 || selectedCartIndex >= cart.length) {
            setSelectedCartIndex(null);
        }
    }, [cart, selectedCartIndex]);

    // Check for active shift on mount (Persistence)
    const initRef = useRef(false);
    useEffect(() => {
        if (initRef.current) return;
        initRef.current = true;

        const checkActiveShift = async () => {
            try {
                // If session is already open, don't check
                if (session.isOpen) return;

                // Get ID of logged in user
                let userId = null;
                let userObj = null;
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    try {
                        userObj = JSON.parse(userStr);
                        userId = userObj.id || userObj.userId;
                    } catch (e) { console.error("Error parsing user", e); }
                }

                // Pass userId to ensure we only get a shift for THIS cashier
                const res = await posService.getCurrentShift(TERMINAL_ID, userId);
                const shift = res.data?.data || res.data;

                if (shift && shift.shiftId) {
                    console.log("Restoring active shift:", shift);

                    // If we filtered by userId, shift.cashierId should match userId.
                    // If userId was null, it might be any shift (legacy behavior fallback).

                    let cashierName = shift.cashierName;
                    if ((!cashierName || cashierName === "Restored User") && userObj) {
                        cashierName = userObj.username || userObj.name;
                    }

                    setSession({
                        isOpen: true,
                        cashier: cashierName || "Unknown User",
                        userId: shift.cashierId,
                        shiftId: shift.shiftId,
                        shiftNo: shift.shiftNo,
                        terminalCode: `POS-${String(TERMINAL_ID).padStart(2, '0')}`
                    });

                    // Do NOT show FLOAT modal, ensure it is closed
                    setActiveModal(null);

                    addNotification('info', 'Session Restored', `Resumed Shift #${shift.shiftId}`);
                } else {
                    // No active shift found -> Show Open Shift (Float) modal
                    setActiveModal('FLOAT');
                }
            } catch (err) {
                // No active shift found (404), or error. User must open shift.
                console.log("No active shift found, waiting for login.");
                setActiveModal('FLOAT');
            }
        };

        checkActiveShift();
    }, []); // Run once on mount

    // Fetch next invoice number from backend
    useEffect(() => {
        const fetchNextInvoice = async () => {
            if (session.isOpen) {
                try {
                    const res = await posService.getLastInvoiceNumber(session.branchId || 1);
                    const lastInvoice = res.data?.data || res.data;

                    let lastNum = 0;
                    if (lastInvoice) {
                        if (typeof lastInvoice === 'number') {
                            lastNum = lastInvoice;
                        } else if (lastInvoice.nextSequence) {
                            // If backend explicitly sends nextSequence, use it (subtract 1 because we add 1 below)
                            lastNum = lastInvoice.nextSequence - 1;
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
                } catch (e) {
                    console.error("Failed to fetch next invoice no", e);
                    // Keep default or previous value
                }
            }
        };
        fetchNextInvoice();
    }, [session.isOpen]);

    // Generate invoice ID using next sequential number when cart has items
    useEffect(() => {
        if (session.isOpen) {
            // Even if cart is empty, show the next invoice number (as requested: "show exact invoice number... in topbar while adding items")
            // Actually, usually users want to see it immediately.

            const today = new Date();
            const datePart = today.getFullYear().toString() +
                String(today.getMonth() + 1).padStart(2, '0') +
                String(today.getDate()).padStart(2, '0');

            const numPart = String(nextInvoiceNo).padStart(5, '0');
            const formattedId = `INV-${datePart}-${numPart}`;

            // Only update if current is placeholder or different
            // AND we are NOT currently working on an existing (recalled) sale ID
            if (!currentSaleId && (invoiceId === 'INV-READY' || invoiceId !== formattedId)) {
                setInvoiceId(formattedId);
            }
        }
    }, [session.isOpen, nextInvoiceNo, currentSaleId, invoiceId]);

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
            // 1. First verify the supervisor credentials and check their role
            const authRes = await authService.login({
                username: supervisorCreds.username,
                password: supervisorCreds.password
            });
            const approver = authRes.data || authRes;

            // 2. Check permissions
            const allowedRoles = ['ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR'];
            const approverRole = (approver.role || approver.userRole || "").toUpperCase();

            if (!allowedRoles.includes(approverRole)) {
                throw new Error(`Access Denied: ${approverRole} cannot approve shift end.`);
            }

            await posService.closeShift(session.shiftId, {
                closingCash: parseFloat(closingAmount),
                denominations: denominations,
                notes: "Shift Closed",
                supervisorUsername: supervisorCreds.username,
                supervisorPassword: supervisorCreds.password,
                approvedBy: approver.userId || approver.id
            });
            setSession({
                isOpen: false,
                cashier: "--",
                shiftId: null,
                userId: null,
                terminalCode: `POS-${String(TERMINAL_ID).padStart(2, '0')}`
            });
            // Clear notifications only on successful close shift to start fresh next time
            localStorage.removeItem('pos_notifications');

            addNotification('success', 'Shift Closed', 'Redirecting to login...');
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
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

            let notification = null;
            setCart(prev => {
                const existingIndex = prev.findIndex(item =>
                    item.id === product.id ||
                    (item.barcode && item.barcode === product.barcode) ||
                    (item.sku && item.sku === product.sku)
                );
                if (existingIndex >= 0) {
                    const updated = [...prev];
                    const newQty = updated[existingIndex].qty + 1;
                    updated[existingIndex] = {
                        ...updated[existingIndex],
                        qty: newQty
                    };
                    notification = { type: 'info', title: 'Quantity Updated', message: `${product.name} x${newQty}` };
                    return updated;
                }
                notification = { type: 'success', title: 'Item Added', message: `${product.name} added to cart` };
                return [...prev, product];
            });
            if (notification) {
                addNotification(notification.type, notification.title, notification.message);
            }

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
        if (cart.length === 0) {
            addNotification('warning', 'Empty Cart', 'Add items first.');
            return;
        }
        if (!session.shiftId) {
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
        const itemDiscount = cart.reduce((sum, item) => sum + ((item.discount || 0) * item.qty), 0);
        const totalDiscount = itemDiscount + billDiscount; // Include bill-level discount
        const taxAmount = cart.reduce((sum, item) => {
            const itemTotal = (item.price * item.qty) - ((item.discount || 0) * item.qty);
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
            saleId: currentSaleId, // Include ID if updating existing
            branchId: branchId,
            cashierId: session.userId,
            customerId: customer ? customer.customerId || customer.id : null,
            shiftId: session.shiftId,
            grossTotal: grossTotal,
            discount: totalDiscount, // Total discount including bill-level
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
            // Update customer loyalty points if applicable
            let loyaltyMsg = "";
            if (customer && customer.id) {
                const pointsEarned = Math.floor(netTotal / 100); // 1 point per 100 spent
                if (pointsEarned > 0) {
                    try {
                        await posService.updateLoyaltyPoints(customer.id, pointsEarned);
                        loyaltyMsg = ` | +${pointsEarned} Points`;
                    } catch (e) {
                        console.error("Failed to update loyalty points", e);
                    }
                }
            }

            addNotification('success', 'Sale Complete', `Invoice: ${finalInvoiceId} | Change: LKR ${paymentDetails.changeAmount?.toFixed(2) || '0.00'}${loyaltyMsg}`);

            // Update next invoice number locally so the UI updates instantly
            if (finalInvoiceId) {
                const match = finalInvoiceId.match(/(\d+)$/);
                if (match) {
                    setNextInvoiceNo(parseInt(match[1]) + 1);
                } else {
                    setNextInvoiceNo(prev => prev + 1);
                }
            } else {
                setNextInvoiceNo(prev => prev + 1);
            }

            // Reset cart and close modal
            setCart([]);
            setCustomer(null);
            setCurrentSaleId(null); // Clear active sale ID
            setBillDiscount(0); // Reset bill discount
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
        if (editingCartIndex !== null && editingCartIndex !== index) {
            setEditingCartIndex(null);
        }
    };

    const handleInlineQuantityCommit = (index, rawQty) => {
        const parsed = Number(rawQty);
        if (!Number.isFinite(parsed) || parsed <= 0) {
            addNotification('warning', 'Invalid Quantity', 'Enter a quantity greater than 0.');
            return;
        }
        setCart(prev => {
            const newCart = [...prev];
            if (!newCart[index]) return prev;
            newCart[index] = { ...newCart[index], qty: parsed };
            return newCart;
        });
        setEditingCartIndex(null);
        inputRef.current?.focus();
    };

    const handleInlineQuantityCancel = () => {
        setEditingCartIndex(null);
        inputRef.current?.focus();
    };

    const handleOpenCashierSummary = async () => {
        if (!session.shiftId) {
            addNotification('warning', 'No Active Shift', 'Open a shift to view summary.');
            return;
        }
        setActiveModal('CASHIER_SUMMARY');
        setCashierSummaryLoading(true);
        try {
            const res = await posService.getShiftTotals(session.shiftId);
            const data = res.data?.data || res.data || {};
            setCashierSummary(data);

        } catch (e) {
            console.error('Failed to load cashier summary:', e);
            addNotification('error', 'Summary Error', e.response?.data?.message || 'Failed to load cashier summary.');
            setCashierSummary(null);
        } finally {
            setCashierSummaryLoading(false);
        }
    };

    const handleVoidItem = (index) => {
        const fallbackIndex = selectedCartIndex ?? (cart.length - 1);
        const targetIndex = index !== undefined ? index : fallbackIndex;
        if (targetIndex < 0 || targetIndex >= cart.length) return;
        const item = cart[targetIndex];
        showConfirm("Void Item", `Remove "${item.name}" from cart?`, () => {
            const newCart = [...cart];
            newCart.splice(targetIndex, 1);
            setCart(newCart);
            setSelectedCartIndex(prev => {
                if (prev === null || prev === undefined) return null;
                if (prev === targetIndex) {
                    return newCart.length ? Math.min(targetIndex, newCart.length - 1) : null;
                }
                if (prev > targetIndex) return prev - 1;
                return prev;
            });
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
        if (action === 'HOLD') {
            if (cart.length === 0) return;
            showConfirm("Suspend Transaction", "Park this transaction for later?", async () => {
                try {
                    // Calculate totals for held bill
                    const grossTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
                    const itemDiscount = cart.reduce((sum, item) => sum + ((item.discount || 0) * item.qty), 0);
                    const totalDiscount = itemDiscount + billDiscount;
                    const taxAmount = cart.reduce((sum, item) => {
                        const itemTotal = (item.price * item.qty) - ((item.discount || 0) * item.qty);
                        return sum + (itemTotal * (item.taxRate || 0) / 100);
                    }, 0);
                    const netTotal = grossTotal - totalDiscount + taxAmount;

                    await posService.holdBill({
                        saleId: currentSaleId, // Keep same ID if re-holding
                        branchId: branchId,
                        cashierId: session.userId,
                        shiftId: session.shiftId,
                        customerId: customer?.customerId || customer?.id || null,
                        grossTotal: grossTotal,
                        discount: totalDiscount,
                        taxAmount: taxAmount,
                        netTotal: netTotal,
                        items: cart.map(item => ({
                            productId: item.id,
                            quantity: item.qty,
                            unitPrice: item.price,
                            discount: item.discount || 0,
                            taxRate: item.taxRate || 0
                        }))
                    });
                    setCart([]);
                    setCustomer(null);
                    setCurrentSaleId(null);
                    setBillDiscount(0);
                    setActiveModal(null);
                    setInvoiceId("INV-READY");
                    // Refresh next number just in case
                    setNextInvoiceNo(prev => prev);
                    addNotification('info', 'Bill Held', 'Transaction parked successfully.');
                } catch (err) {
                    addNotification('error', 'Hold Failed', err.response?.data?.message || 'Could not hold bill.');
                }
            });
        }
        else if (action === 'CANCEL') {
            if (cart.length === 0) return;
            showConfirm("Cancel Transaction", "Void the entire bill?", () => {
                setCart([]);
                setCustomer(null);
                setCurrentSaleId(null);
                setBillDiscount(0);
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
            // Open the new SmartReturnModal directly
            setActiveModal('SMART_RETURN');
        }
        else if (action === 'EXIT') {
            if (cart.length > 0) {
                showConfirm("Pending Items", "You have items in cart. Cancel them before closing shift.", null, true);
                return;
            }
            setShiftTotals(null);
            setActiveModal('END_SHIFT');
            setShiftTotals(null);
            setActiveModal('END_SHIFT');
            fetchShiftTotals();
        }
        else if (action === 'PAY_CASH') { openPaymentModal('CASH'); }
        else if (action === 'PAY_CARD') { openPaymentModal('CARD'); }
        else if (action === 'PAY_QR') { openPaymentModal('QR'); }
    };

    const handleRecallBill = async (bill) => {
        try {
            // Check if this is a Return action
            if (listConfig?.type === 'RETURN') {
                setReturnSource(bill);
                setListConfig(null);
                setActiveModal('RETURN_DETAILS');
                return;
            }

            const res = await posService.recallBill(bill.saleId || bill.id);
            const data = res.data?.data || res.data;

            // Populate cart with recalled items
            if (data.items && Array.isArray(data.items)) {
                const recalledCart = data.items.map(item => ({
                    id: item.productId,
                    name: item.productName || item.name,
                    price: item.unitPrice,
                    qty: item.quantity || item.qty,
                    discount: item.discount || 0,
                    taxRate: item.taxRate || 0
                }));
                setCart(recalledCart);
            }

            // Set customer if exists (handle nested object or flat fields)
            if (data.customer) {
                setCustomer({
                    id: data.customer.id || data.customer.customerId,
                    customerId: data.customer.id || data.customer.customerId,
                    name: data.customer.name,
                    phone: data.customer.phone,
                    email: data.customer.email,
                    loyaltyPoints: data.customer.loyaltyPoints || 0
                });
            } else if (data.customerId) {
                // Fallback for flat response structure
                setCustomer({
                    id: data.customerId,
                    customerId: data.customerId,
                    name: data.customerName || 'Customer'
                });
            }

            // Restore Invoice ID and internal Sale ID
            if (bill.invoiceNo) setInvoiceId(bill.invoiceNo);
            if (bill.saleId || bill.id) setCurrentSaleId(bill.saleId || bill.id);

            setListConfig(null);
            setActiveModal(null);
            addNotification('success', 'Bill Recalled', `Bill #${bill.invoiceNo || bill.id} loaded.`);
        } catch (e) {
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
            if (e.key === 'q' || e.key === 'Q') {
                if (selectedCartIndex !== null && selectedCartIndex !== undefined) {
                    e.preventDefault();
                    setEditingCartIndex(selectedCartIndex);
                }
            }

            if (!activeModal && document.activeElement.tagName !== 'INPUT') {
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeModal, cart, session.isOpen, selectedCartIndex]);

    return (
        <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden font-sans relative">
            {/* HEADER */}
            <header className="bg-slate-900 text-white h-16 shrink-0 flex items-center justify-between px-4 shadow-md z-30 border-b border-slate-800">
                <div className="flex items-center gap-4">
                    {/* Terminal & Branch */}
                    <div className="flex flex-col leading-none">
                        <span className="font-bold text-2xl text-green-400 tracking-tight">{session.terminalCode}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                            <Store className="w-3 h-3" /> {branchInfo.name || `Branch ${branchId}`}
                        </span>
                    </div>

                    <div className="h-10 w-px bg-slate-700"></div>

                    {/* Enhanced Invoice Display */}
                    <div className="h-12 flex items-center">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Invoice</span>
                            <div className="flex items-center gap-1">
                                {invoiceId === 'INV-READY' ? (
                                    <span className="font-mono text-lg font-bold text-slate-400 animate-pulse">READY</span>
                                ) : (
                                    <>
                                        {/* Split invoice number into parts for better readability */}
                                        {(() => {
                                            const parts = invoiceId.split('-');
                                            if (parts.length >= 3) {
                                                return (
                                                    <>
                                                        <span className="font-mono text-xs font-bold text-blue-400">{parts[0]}</span>
                                                        <span className="text-slate-600">-</span>
                                                        <span className="font-mono text-sm font-bold text-cyan-400">{parts[1]}</span>
                                                        <span className="text-slate-600">-</span>
                                                        <span className="font-mono text-xl font-black text-green-400 tracking-wider">{parts[2]}</span>
                                                    </>
                                                );
                                            }
                                            return <span className="font-mono text-xl font-bold text-white">{invoiceId}</span>;
                                        })()}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {session.shiftId && (
                        <div className="h-12 flex items-center ml-4">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Active Shift</span>
                                <span className="text-lg text-green-400 font-mono font-bold">#{session.shiftId}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-6">
                    <button onClick={() => setIsOpen(true)} className="relative p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>}
                    </button>

                    {/* GRN Payment Request Notification */}
                    <button
                        onClick={() => setShowGRNPaymentModal(true)}
                        className="relative p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-300 hover:text-purple-400"
                        title="GRN Payment Requests"
                    >
                        <Receipt className="w-5 h-5" />
                        {grnPaymentCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-purple-500 text-white text-[10px] font-bold rounded-full border-2 border-slate-900 animate-pulse">
                                {grnPaymentCount > 9 ? '9+' : grnPaymentCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={handleOpenCashierSummary}
                        disabled={!session.isOpen}
                        className="flex items-center gap-3 bg-blue-900/40 border border-blue-500/30 rounded-full py-1.5 px-4 hover:bg-blue-900/60 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <User className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-bold tracking-wide uppercase text-blue-100">{session.cashier}</span>
                    </button>
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
                    selectedIndex={selectedCartIndex}
                    editingIndex={editingCartIndex}
                    onQuantityCommit={handleInlineQuantityCommit}
                    onQuantityCancel={handleInlineQuantityCancel}
                    onDetachCustomer={() => setCustomer(null)}
                    billDiscount={billDiscount}
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
                    terminalId={TERMINAL_ID}
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
                    onRefresh={fetchShiftTotals}
                />
            )}
            {activeModal === 'PAYMENT' && (
                <PaymentModal
                    total={cartTotals.netTotal}
                    cart={cart}
                    customer={customer}
                    invoiceId={invoiceId}
                    cashierName={session.cashier}
                    branchInfo={branchInfo}
                    totals={cartTotals}
                    initialMethod={listConfig?.mode || 'CASH'}
                    onClose={() => setActiveModal(null)}
                    onProcess={processPayment}
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
                            const items = getQuickItems(TERMINAL_ID);

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
                                saveQuickItemsHelper(TERMINAL_ID, items);
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
            {activeModal === 'CASHIER_SUMMARY' && (
                <CashierSummaryModal
                    cashierName={session.cashier}
                    shiftId={session.shiftId}
                    summary={cashierSummary}
                    loading={cashierSummaryLoading}
                    onClose={() => { setActiveModal(null); setCashierSummary(null); }}
                />
            )}
            {activeModal === 'RETURN_DETAILS' && returnSource && (
                <ReturnModal
                    sale={returnSource}
                    branchId={branchId}
                    onClose={() => { setActiveModal(null); setReturnSource(null); }}
                    onNotify={addNotification}
                />
            )}
            {activeModal === 'SMART_RETURN' && (
                <SmartReturnModal
                    branchId={branchId}
                    onClose={() => setActiveModal(null)}
                    onNotify={addNotification}
                />
            )}
            {activeModal === 'DISCOUNT' && (
                <DiscountModal
                    selectedItem={selectedCartIndex !== null ? cart[selectedCartIndex] : null}
                    cartTotal={cart.reduce((sum, item) => sum + (item.price * item.qty) - ((item.discount || 0) * item.qty), 0)}
                    onClose={() => setActiveModal(null)}
                    onApply={(discountData) => {
                        if (discountData.scope === 'item' && selectedCartIndex !== null) {
                            // Apply to selected item
                            handleApplyItemDiscount(selectedCartIndex, discountData.discountAmount / cart[selectedCartIndex].qty);
                        } else {
                            // Apply to bill
                            setBillDiscount(discountData.discountAmount);
                            addNotification('success', 'Bill Discount Applied', `LKR ${discountData.discountAmount.toFixed(2)} discount applied to bill.`);
                        }
                    }}
                />
            )}

            {/* GRN Payment Request Modal */}
            <GRNPaymentModal
                isOpen={showGRNPaymentModal}
                onClose={() => {
                    setShowGRNPaymentModal(false);
                    // Refresh count after modal closes
                    grnPaymentService.getPendingCount(branchId)
                        .then(res => setGrnPaymentCount(res.data?.data?.count || 0))
                        .catch(() => { });
                }}
                branchId={branchId}
                onNotification={addNotification}
            />
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