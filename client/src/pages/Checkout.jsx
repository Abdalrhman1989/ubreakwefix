import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Store, Package, Calendar, Clock, Check,
    CreditCard, ChevronLeft, User, Mail, Phone,
    MapPin, FileText, ShieldCheck, Trash2, Truck, Home, ShoppingBag, Map
} from 'lucide-react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

const Checkout = () => {
    const { cart, removeFromCart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine if cart contains repairs
    const hasRepairs = cart.some(item => item.repairName || item.isRepair);
    const isShopOnly = !hasRepairs && cart.length > 0;

    // Steps: 1 = Details, 2 = Success
    const [step, setStep] = useState(1);

    // Service Method (Repair Only): 'walk-in' | 'mail-in'
    const [serviceMethod, setServiceMethod] = useState('walk-in');

    // Walk-in Payment Method: 'online' | 'store'
    const [walkInPayment, setWalkInPayment] = useState('store');

    // Mail-in sub-option: 'buy-label' | 'self-send'
    const [mailInType, setMailInType] = useState('buy-label');
    const [selectedReturnLabel, setSelectedReturnLabel] = useState(null); // { id: 'gls_return', price: 49, name: ... }

    // Shipping Method (Shop Only)
    const [shippingOptions, setShippingOptions] = useState([]);
    const [selectedShipping, setSelectedShipping] = useState(null);
    const [dropPoints, setDropPoints] = useState([]);
    const [selectedDropPoint, setSelectedDropPoint] = useState(null);

    const [customerType, setCustomerType] = useState('private'); // 'private' | 'business'

    // Booking State (Walk-in)
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    // Booking Dates
    const [availableDates, setAvailableDates] = useState([]);
    useEffect(() => {
        const dates = [];
        const days = ['Søn', 'Man', 'Tirs', 'Ons', 'Tors', 'Fre', 'Lør'];
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            dates.push({
                date: d.toISOString().split('T')[0],
                dayName: days[d.getDay()],
                dayNum: d.getDate()
            });
        }
        setAvailableDates(dates);
        setSelectedDate(dates[0].date);
    }, []);

    const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

    // Form Data
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '',
        address: '', postalCode: '', city: '',
        notes: '', termsAccepted: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Pre-fill user data
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            }));
        }
    }, [user]);

    // Available Return Labels
    const returnLabels = [
        { id: 'gls_return', name: 'GLS Returlabel', price: 49, carrier: 'gls' },
        { id: 'dao_return', name: 'DAO Returlabel', price: 39, carrier: 'dao' },
        { id: 'pdk_return', name: 'PostNord Returlabel', price: 59, carrier: 'pdk' }
    ];
    useEffect(() => {
        if (returnLabels.length > 0) setSelectedReturnLabel(returnLabels[0]);
    }, []);

    // Fetch Shipping Options for Shop Only
    useEffect(() => {
        if (isShopOnly) {
            axios.get('/api/shipping/products')
                .then(res => {
                    setShippingOptions(res.data);
                    if (res.data.length > 0) setSelectedShipping(res.data[0]);
                })
                .catch(err => console.error("Failed to load shipping", err));
        }
    }, [isShopOnly]);

    // Fetch Drop Points
    useEffect(() => {
        if (isShopOnly && selectedShipping && selectedShipping.id.includes('shop') && formData.postalCode.length === 4) {
            axios.post('/api/shipping/droppoints', { zipcode: formData.postalCode, carrier: selectedShipping.carrier })
                .then(res => {
                    setDropPoints(res.data);
                    if (res.data.length > 0) setSelectedDropPoint(res.data[0]);
                })
                .catch(err => console.error("Failed to fetch drop points", err));
        } else {
            setDropPoints([]);
            setSelectedDropPoint(null);
        }
    }, [isShopOnly, selectedShipping, formData.postalCode]);

    // Check Success Return
    useEffect(() => {
        if (location.pathname === '/checkout/success') {
            clearCart();
            setStep(2);

            // Auto-verify payment (Fix for Localhost/Missing Webhook)
            const params = new URLSearchParams(location.search);
            const orderId = params.get('order_id');
            if (orderId) {
                console.log("Verifying Order:", orderId);
                axios.get(`/api/payment/verify/${orderId}`)
                    .then(res => console.log("Verification Result:", res.data))
                    .catch(err => console.error("Verification Failed:", err));
            }
        }
    }, [location]);

    // Auto-fill City from Zip
    useEffect(() => {
        if (formData.postalCode.length === 4) {
            fetch(`https://api.dataforsyningen.dk/postnumre/${formData.postalCode}`)
                .then(res => res.json())
                .then(data => {
                    if (data.navn) {
                        setFormData(prev => ({ ...prev, city: data.navn }));
                    }
                })
                .catch(err => console.log('City lookup failed', err));
        }
    }, [formData.postalCode]);

    // Calculations
    const cartTotal = getCartTotal();

    // Fee Logic
    let shippingFee = 0;
    if (hasRepairs) {
        if (serviceMethod === 'mail-in') {
            shippingFee = mailInType === 'buy-label' && selectedReturnLabel ? selectedReturnLabel.price : 0;
        } else {
            shippingFee = 0; // Walk-in
        }
    } else {
        // Shop Logic
        shippingFee = selectedShipping ? selectedShipping.price : 0;
    }

    const finalTotal = cartTotal + shippingFee;
    const subtotal = Math.round(finalTotal * 0.8);
    const vat = finalTotal - subtotal;

    const handleSubmit = async (e) => {
        console.log("DEBUG: Checkout handleSubmit CALLED");
        e.preventDefault();
        setError('');
        if (!formData.termsAccepted) {
            setError(t('checkout.errorTerms'));
            return;
        }
        if (hasRepairs && serviceMethod === 'mail-in' && mailInType === 'buy-label' && (!formData.address || !formData.postalCode)) {
            setError(t('checkout.errorAddressLabel'));
            return;
        }
        if (isShopOnly && (!formData.address || !formData.postalCode)) {
            setError(t('checkout.errorAddressDelivery'));
            return;
        }

        setIsSubmitting(true);

        try {
            // Data Payload
            const orderData = {
                userId: user?.id,
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                totalAmount: finalTotal,
                items: cart.map(item => ({
                    ...item,
                    orderNotes: formData.notes
                })),

                // Metadata
                meta: {
                    serviceMethod: hasRepairs ? serviceMethod : 'shipping',
                    customerType,
                    bookingDate: (hasRepairs && serviceMethod === 'walk-in') ? selectedDate : null,
                    bookingTime: (hasRepairs && serviceMethod === 'walk-in') ? selectedTime : null,
                    paymentMethod: (hasRepairs && serviceMethod === 'walk-in') ? walkInPayment : 'online',
                    mailInType: (hasRepairs && serviceMethod === 'mail-in') ? mailInType : null,
                    shippingAddress: {
                        street: formData.address,
                        zip: formData.postalCode,
                        city: formData.city
                    },
                    shippingOption: isShopOnly ? selectedShipping : null,
                    dropPoint: isShopOnly ? selectedDropPoint : null
                }
            };

            // 1. Create Order
            const orderRes = await axios.post('/api/shop/orders', orderData);
            const orderId = orderRes.data.id;

            // 2. If Mail-in Repair + Buy Label: Create Label
            if (hasRepairs && serviceMethod === 'mail-in' && mailInType === 'buy-label') {
                try {
                    const labelRes = await axios.post('/api/shipping/create-label', {
                        sender: {
                            name: formData.name,
                            address: formData.address,
                            zip: formData.postalCode,
                            city: formData.city,
                            email: formData.email,
                            phone: formData.phone
                        },
                        // In real implementation we'd pass the carrier choice from selectedReturnLabel
                        // For now default logic applies or we update endpoint
                    });

                    if (labelRes.data && labelRes.data.label_url) {
                        await axios.put(`/api/shop/orders/${orderId}/shipping-label`, {
                            label_url: labelRes.data.label_url,
                            pkg_no: labelRes.data.pkg_no
                        });
                    }
                } catch (shipErr) {
                    console.error("Label creation warning:", shipErr);
                }
            }

            // 3. Payment Flow
            // If Walk-in AND Pay in Store -> SKIP Payment Link
            if (hasRepairs && serviceMethod === 'walk-in' && walkInPayment === 'store') {
                // Determine a success mechanism. For now, navigate manually to success.
                // In a real app we might want an Order Confirmation API endpoint that doesn't need Quickpay.
                // But since we just Created the order, we can assume success.
                clearCart();
                setStep(2);
                return;
            }

            // Otherwise, get Payment Link
            const paymentRes = await axios.post('/api/payment/link', {
                amount: finalTotal,
                orderId: orderId,
                text_on_statement: 'UBreakWeFix'
            });

            if (paymentRes.data.url) {
                window.location.href = paymentRes.data.url;
            } else {
                throw new Error('Fejl ved betalingslink');
            }

        } catch (err) {
            console.error("Checkout Failed:", err);
            setError(err.response?.data?.error || err.message);
            setIsSubmitting(false);
        }
    };

    if (step === 2) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
                <Helmet><title>{t('checkout.orderConfirmed')} | UBreak WeFix</title></Helmet>
                <div style={{ width: '90px', height: '90px', background: '#DCFCE7', borderRadius: '50%', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <ShieldCheck size={48} />
                </div>
                <h1 style={{ marginBottom: '15px', fontSize: '2.5rem', fontWeight: '800' }}>{t('checkout.orderConfirmed')}</h1>
                <p style={{ color: '#6B7280', marginBottom: '40px', fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto 40px' }}>
                    {t('checkout.thankYou')}<br />
                    {t('checkout.orderReceived')}
                </p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <button onClick={() => navigate('/')} className="btn btn-outline">{t('checkout.backToHome')}</button>
                    {user && <button onClick={() => navigate('/profile')} className="btn btn-primary">{t('checkout.viewOrders')}</button>}
                </div>
            </div>
        );
    }

    if (cart.length === 0) return (
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '20px' }}>{t('checkout.emptyCart')}</h2>
            <button onClick={() => navigate('/reparationer')} className="btn btn-primary">{t('checkout.browseRepairs')}</button>
            <button onClick={() => navigate('/shop')} className="btn btn-outline" style={{ marginLeft: '10px' }}>{t('checkout.backToShop')}</button>
        </div>
    );

    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '100vh', padding: '40px 0' }}>
            <Helmet><title>{t('checkout.completeBooking')} | UBreak WeFix</title></Helmet>

            <div className="container">
                <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', marginBottom: '30px', color: 'var(--text-muted)', fontWeight: '500' }}>
                    <ChevronLeft size={20} /> {t('checkout.backToShop')}
                </button>

                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '40px', color: 'var(--text-main)' }}>{t('checkout.completeBooking')}</h1>
                {error && <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '15px', borderRadius: '8px', marginBottom: '30px' }}>{error}</div>}

                <div className="checkout-grid">

                    {/* LEFT COL: SERVICE/SHIPPING METHOD */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px', color: 'var(--text-muted)' }}>
                                {hasRepairs ? t('checkout.serviceMethod') : t('checkout.deliveryMethod')}
                            </h3>

                            <div className="card-glass" style={{ padding: '25px', borderRadius: '16px', background: 'var(--bg-surface)' }}>

                                {/* ----------------------- */}
                                {/* REPAIR FLOW SELECTORS   */}
                                {/* ----------------------- */}
                                {hasRepairs && (
                                    <>
                                        {/* Option 1: Walk-In */}
                                        <div
                                            onClick={() => setServiceMethod('walk-in')}
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '20px', borderRadius: '12px', cursor: 'pointer', marginBottom: '15px',
                                                border: serviceMethod === 'walk-in' ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                                                background: serviceMethod === 'walk-in' ? 'rgba(var(--primary-rgb), 0.05)' : 'transparent'
                                            }}
                                        >
                                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                <div style={{ background: '#F3F4F6', padding: '10px', borderRadius: '10px', color: '#000' }}><Store size={24} /></div>
                                                <div>
                                                    <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{t('checkout.walkIn')} <span style={{ fontSize: '0.8rem', background: '#E0E7FF', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px' }}>{t('checkout.free')}</span></div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('checkout.walkInDesc')}</div>
                                                </div>
                                            </div>
                                            {serviceMethod === 'walk-in' ? <div style={{ background: 'var(--primary)', color: '#fff', borderRadius: '4px', padding: '2px' }}><Check size={16} /></div> : <div style={{ width: 20, height: 20, border: '2px solid #ddd', borderRadius: '4px' }} />}
                                        </div>

                                        {/* Walk-In Details */}
                                        {serviceMethod === 'walk-in' && (
                                            <div style={{ marginLeft: '10px', borderLeft: '2px solid var(--border-light)', paddingLeft: '20px', marginBottom: '30px' }}>

                                                {/* Shop Address & Map */}
                                                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>UBreak WeFix</div>
                                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Skibhusvej 109, 5000 Odense</div>
                                                    </div>
                                                    <a href="https://maps.google.com/?q=Skibhusvej%20109,%205000%20Odense" target="_blank" rel="noopener noreferrer"
                                                        style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
                                                        <Map size={18} /> {t('checkout.showOnMap')}
                                                    </a>
                                                </div>

                                                <div style={{ marginBottom: '20px' }}>
                                                    <div style={{ fontWeight: '600', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%' }}></span> {t('checkout.selectDate')}</div>
                                                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                                                        {availableDates.map((d, i) => (
                                                            <div key={i} onClick={() => setSelectedDate(d.date)} style={{
                                                                minWidth: '60px', padding: '10px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer',
                                                                border: selectedDate === d.date ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                                                                background: selectedDate === d.date ? 'var(--bg-primary-light)' : 'var(--bg-input)'
                                                            }}>
                                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d.dayName}</div>
                                                                <div style={{ fontWeight: '700', fontSize: '1.2rem' }}>{d.dayNum}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div style={{ marginBottom: '20px' }}>
                                                    <div style={{ fontWeight: '600', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%' }}></span> {t('checkout.selectTime')}</div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                                        {timeSlots.map(time => (
                                                            <div key={time} onClick={() => setSelectedTime(time)} style={{
                                                                padding: '8px', textAlign: 'center', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
                                                                background: selectedTime === time ? 'var(--primary)' : 'var(--bg-input)',
                                                                color: selectedTime === time ? '#fff' : 'var(--text-main)'
                                                            }}>
                                                                {time}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Payment Method for Walk-in */}
                                                <div>
                                                    <div style={{ fontWeight: '600', marginBottom: '10px' }}>{t('checkout.payment')}</div>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <div
                                                            onClick={() => setWalkInPayment('online')}
                                                            style={{
                                                                flex: 1, padding: '12px', borderRadius: '8px', border: walkInPayment === 'online' ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                                                                cursor: 'pointer', textAlign: 'center', fontWeight: '600',
                                                                background: walkInPayment === 'online' ? 'var(--bg-primary-light)' : 'transparent'
                                                            }}
                                                        >
                                                            {t('checkout.payOnline')}
                                                        </div>
                                                        <div
                                                            onClick={() => setWalkInPayment('store')}
                                                            style={{
                                                                flex: 1, padding: '12px', borderRadius: '8px', border: walkInPayment === 'store' ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                                                                cursor: 'pointer', textAlign: 'center', fontWeight: '600',
                                                                background: walkInPayment === 'store' ? 'var(--bg-primary-light)' : 'transparent'
                                                            }}
                                                        >
                                                            {t('checkout.payInStore')}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        )}

                                        {/* Option 2: Mail-In */}
                                        <div
                                            data-testid="service-mail-in"
                                            onClick={() => setServiceMethod('mail-in')}
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '20px', borderRadius: '12px', cursor: 'pointer',
                                                border: serviceMethod === 'mail-in' ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                                                background: serviceMethod === 'mail-in' ? 'rgba(var(--primary-rgb), 0.05)' : 'transparent'
                                            }}
                                        >
                                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                <div style={{ background: '#F3F4F6', padding: '10px', borderRadius: '10px', color: '#000' }}><Package size={24} /></div>
                                                <div>
                                                    <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{t('checkout.sendDeviceFree')} <span style={{ fontSize: '0.8rem', background: '#E0E7FF', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px' }}>{t('checkout.free')}</span></div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('checkout.sendDeviceDesc')}</div>
                                                </div>
                                            </div>
                                            {serviceMethod === 'mail-in' ? <div style={{ background: 'var(--primary)', color: '#fff', borderRadius: '4px', padding: '2px' }}><Check size={16} /></div> : <div style={{ width: 20, height: 20, border: '2px solid #ddd', borderRadius: '4px' }} />}
                                        </div>

                                        {/* Mail-In Options */}
                                        {serviceMethod === 'mail-in' && (
                                            <div style={{ marginLeft: '10px', borderLeft: '2px solid var(--border-light)', paddingLeft: '20px', marginBottom: '30px' }}>

                                                {/* Shipping Type Selector */}
                                                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                                    <button
                                                        onClick={() => setMailInType('buy-label')}
                                                        className={`btn ${mailInType === 'buy-label' ? 'btn-sm-primary' : 'btn-sm-outline'}`}
                                                        style={{ padding: '8px 15px', borderRadius: '20px', border: mailInType === 'buy-label' ? 'none' : '1px solid #ccc', background: mailInType === 'buy-label' ? 'var(--primary)' : '#fff', color: mailInType === 'buy-label' ? '#fff' : '#666' }}
                                                    >
                                                        {t('checkout.buyLabel')}
                                                        returlabel
                                                    </button>
                                                    <button
                                                        onClick={() => setMailInType('self-send')}
                                                        className={`btn ${mailInType === 'self-send' ? 'btn-sm-primary' : 'btn-sm-outline'}`}
                                                        style={{ padding: '8px 15px', borderRadius: '20px', border: mailInType === 'self-send' ? 'none' : '1px solid #ccc', background: mailInType === 'self-send' ? 'var(--primary)' : '#fff', color: mailInType === 'self-send' ? '#fff' : '#666' }}
                                                    >
                                                        {t('checkout.sendSelf')}
                                                    </button>
                                                </div>

                                                {/* If Buy Label - Show Carrier Options */}
                                                {mailInType === 'buy-label' && (
                                                    <div style={{ marginBottom: '20px' }}>
                                                        <div style={{ fontWeight: '600', marginBottom: '10px' }}>{t('checkout.selectCarrier')}</div>
                                                        <div style={{ display: 'grid', gap: '10px' }}>
                                                            {returnLabels.map(label => (
                                                                <div
                                                                    key={label.id}
                                                                    onClick={() => setSelectedReturnLabel(label)}
                                                                    style={{
                                                                        display: 'flex', justifyContent: 'space-between', padding: '15px',
                                                                        borderRadius: '8px', border: selectedReturnLabel?.id === label.id ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                                                                        cursor: 'pointer', background: selectedReturnLabel?.id === label.id ? 'var(--bg-primary-light)' : 'var(--bg-element)'
                                                                    }}
                                                                >
                                                                    <div style={{ fontWeight: '600' }}>{label.name}</div>
                                                                    <div>kr {label.price}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <p style={{ marginTop: '10px', fontSize: '0.85rem', color: '#666' }}>
                                                            {t('checkout.labelEmailInfo')}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* If Self Send - Show Address */}
                                                {mailInType === 'self-send' && (
                                                    <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                                                        <div style={{ fontWeight: '700', marginBottom: '5px' }}>{t('checkout.sendPackageTo')}</div>
                                                        <div>UBreak WeFix</div>
                                                        <div>Skibhusvej 109</div>
                                                        <div>5000 Odense</div>
                                                        <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#666' }}>
                                                            {t('checkout.includeNote')}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* ----------------------- */}
                                {/* SHOP ONLY FLOW (Legacy) */}
                                {/* ----------------------- */}
                                {isShopOnly && (
                                    <>
                                        {shippingOptions.length === 0 && <div>{t('checkout.loadingShipping')}</div>}
                                        <div style={{ display: 'grid', gap: '15px' }}>
                                            {shippingOptions.map(option => (
                                                <div
                                                    key={option.id}
                                                    onClick={() => setSelectedShipping(option)}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                        padding: '20px', borderRadius: '12px', cursor: 'pointer',
                                                        border: selectedShipping?.id === option.id ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                                                        background: selectedShipping?.id === option.id ? 'var(--bg-primary-light)' : 'transparent'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                        <div style={{ background: '#F3F4F6', padding: '10px', borderRadius: '10px', color: '#000' }}><Truck size={24} /></div>
                                                        <div>
                                                            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{option.name}</div>
                                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{option.carrier.toUpperCase()}</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ fontWeight: '700' }}>kr {option.price}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Drop Point Selector */}
                                        {selectedShipping?.id.includes('shop') && dropPoints.length > 0 && (
                                            <div style={{ marginTop: '20px' }}>
                                                <label className="form-label">{t('checkout.selectDropPoint')}</label>
                                                <select
                                                    className="input-field"
                                                    style={{ width: '100%', padding: '12px', borderRadius: '8px' }}
                                                    onChange={(e) => {
                                                        const point = dropPoints.find(p => p.id == e.target.value);
                                                        setSelectedDropPoint(point);
                                                    }}
                                                    value={selectedDropPoint?.id || ''}
                                                >
                                                    {dropPoints.map(point => (
                                                        <option key={point.id} value={point.id}>
                                                            {point.name} - {point.address}, {point.zip} {point.city}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Address Fields (Always shown for Shop, or for Repairs if Mail-in and Buy Label) */}
                                {(isShopOnly || (hasRepairs && serviceMethod === 'mail-in' && mailInType === 'buy-label')) && (
                                    <div style={{ marginLeft: '10px', borderLeft: '2px solid var(--border-light)', paddingLeft: '20px', marginTop: '20px' }}>
                                        <h4 style={{ marginBottom: '15px' }}><span style={{ color: 'var(--primary)' }}>●</span> {t('checkout.yourAddress')}</h4>
                                        <div style={{ display: 'grid', gap: '15px' }}>
                                            <input className="input-field" name="address" placeholder={t('checkout.streetPlaceholder')} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px' }}>
                                                <input className="input-field" name="postalCode" placeholder={t('checkout.zipPlaceholder')} value={formData.postalCode} onChange={e => setFormData({ ...formData, postalCode: e.target.value })} />
                                                <input className="input-field" name="city" placeholder={t('checkout.cityPlaceholder')} value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                    {/* RIGHT COL: SUMMARY & FORM */}
                    <div>
                        <div className="card-glass" style={{ padding: '30px', borderRadius: '16px' }}>
                            {/* Product Summary */}
                            <div style={{ marginBottom: '25px', paddingBottom: '10px', borderBottom: '1px solid var(--border-light)' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '15px' }}>{t('checkout.orderSummary')}</h3>
                                {cart.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            {item.image ? (
                                                <img src={item.image} style={{ width: 50, height: 50, objectFit: 'contain' }} alt="Product" />
                                            ) : (
                                                <div style={{ width: 50, height: 50, background: '#f3f3f3', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <ShoppingBag size={24} color="#ccc" />
                                                </div>
                                            )}
                                            <div>
                                                <div style={{ fontWeight: '700', fontSize: '1rem' }}>
                                                    {item.modelName || item.name}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                                    {item.repairName ||
                                                        [item.condition, item.storage, item.color].filter(Boolean).join(' - ')
                                                    }
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: '#999' }}>Qty: {item.quantity || 1}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '5px' }}>
                                            <span style={{ fontWeight: '600' }}>
                                                kr {user && user.role === 'business' ? (item.price * 0.8).toFixed(0) : item.price}
                                            </span>
                                            <button
                                                onClick={() => removeFromCart(item.uniqueId || item.id)}
                                                className="btn-icon-danger"
                                                style={{ padding: '5px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                                title="Fjern"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '25px', paddingBottom: '25px', borderBottom: '1px solid #eee' }}>
                                <div>
                                    <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>{t('checkout.total')}</h2>
                                    <div style={{ color: '#666', fontSize: '0.9rem' }}>{t('checkout.vatIncluded')}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>

                                    {/* Shipping Info */}
                                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                        {hasRepairs ? (
                                            serviceMethod === 'walk-in' ? t('checkout.walkIn') :
                                                (mailInType === 'buy-label' ? selectedReturnLabel?.name : t('checkout.ownShipping'))
                                        ) : (
                                            selectedShipping ? selectedShipping.name : t('checkout.deliveryStub')
                                        )}
                                    </div>

                                    {/* Booking Date */}
                                    {hasRepairs && serviceMethod === 'walk-in' && (
                                        <div style={{ color: 'var(--primary)', fontWeight: '600' }}>{selectedDate} {selectedTime}</div>
                                    )}

                                    <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>kr {finalTotal.toFixed(2)}</h2>
                                </div>
                            </div>

                            {/* Customer Toggle */}
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600' }}>
                                    <input type="checkbox" checked={customerType === 'private'} onChange={() => setCustomerType('private')} style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
                                    {t('checkout.private')}
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600' }}>
                                    <input type="checkbox" checked={customerType === 'business'} onChange={() => setCustomerType('business')} style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
                                    {t('checkout.business')}
                                </label>
                            </div>

                            {/* Contact Form */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div className="floating-label">
                                    <input className="input-field" name="name" placeholder={t('checkout.namePlaceholder')} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="floating-label">
                                    <input className="input-field" name="phone" placeholder={t('checkout.phonePlaceholder')} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <input className="input-field" name="email" placeholder={t('checkout.emailPlaceholder')} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            {hasRepairs && (
                                <div style={{ marginBottom: '25px' }}>
                                    <textarea className="input-field" style={{ minHeight: '100px' }} placeholder={t('checkout.notesPlaceholder')} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                                </div>
                            )}

                            {/* Terms */}
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={formData.termsAccepted} onChange={e => setFormData({ ...formData, termsAccepted: e.target.checked })} style={{ width: 20, height: 20, accentColor: 'var(--primary)' }} />
                                <span>{t('checkout.terms')} <a href="#" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>betingelserne og vilkårene</a></span>
                            </label>

                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="btn-primary checkout-submit-btn"
                                style={{ width: '100%', padding: '15px', fontSize: '1.2rem', background: 'var(--primary)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '700', cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
                            >
                                {isSubmitting ? t('checkout.processing') : ((hasRepairs && serviceMethod === 'walk-in' && walkInPayment === 'store') ? t('checkout.confirmBooking') : t('checkout.pay'))}
                            </button>
                            <div style={{ textAlign: 'right', marginTop: '10px', fontSize: '0.8rem', color: '#666' }}>{t('checkout.total')} <b>kr {finalTotal.toFixed(2)}</b> {t('checkout.vatIncluded')}</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
