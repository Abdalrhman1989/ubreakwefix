import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trash2, ShieldCheck, CreditCard, ChevronLeft, User, Mail, Phone, MapPin, FileText, Home, Truck } from 'lucide-react';
import axios from 'axios';

const Checkout = () => {
    const { cart, removeFromCart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Details & Review, 2: Success

    const location = useLocation();

    // Check for success URL
    useEffect(() => {
        if (location.pathname === '/checkout/success') {
            clearCart();
            setStep(2);
        }
    }, [location]);

    // Form Data State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        postalCode: '',
        city: '',
        notes: ''
    });

    // Loading State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Pre-fill form if user is logged in
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

    const [shippingOptions, setShippingOptions] = useState([]);
    const [selectedShipping, setSelectedShipping] = useState(null);
    const [dropPoints, setDropPoints] = useState([]);
    const [selectedDropPoint, setSelectedDropPoint] = useState(null);

    // Fetch Shipping Options
    useEffect(() => {
        axios.get('/api/shipping/products')
            .then(res => {
                setShippingOptions(res.data);
                // Default to first option
                if (res.data.length > 0) setSelectedShipping(res.data[0]);
            })
            .catch(err => console.error("Failed to load shipping", err));
    }, []);

    // Fetch Drop Points if Drop Point carrier selected
    useEffect(() => {
        if (selectedShipping && selectedShipping.id.includes('shop') && formData.postalCode.length === 4) {
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
    }, [selectedShipping, formData.postalCode]);

    const total = getCartTotal() + (selectedShipping ? selectedShipping.price : 0);
    const subtotal = Math.round(total * 0.8);
    const vat = total - subtotal;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // Prepare Order Data
            const orderData = {
                userId: user ? user.id : null,
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                totalAmount: total,
                items: cart.map(item => ({
                    ...item,
                    orderNotes: formData.notes,
                    address: `${formData.address}, ${formData.postalCode} ${formData.city}`,
                    shipping: selectedShipping ? {
                        id: selectedShipping.id,
                        name: selectedShipping.name,
                        price: selectedShipping.price,
                        pickupPoint: selectedDropPoint
                    } : null
                }))
            };

            // 1. Create Shop Order (Single Record)
            const orderRes = await axios.post('/api/shop/orders', orderData);
            const orderId = orderRes.data.id;

            // 2. Initiate Payment
            const paymentRes = await axios.post('/api/payment/link', {
                amount: total,
                orderId: orderId,
                text_on_statement: 'UBreakWeFix'
            });

            // 3. Redirect to Quickpay
            if (paymentRes.data.url) {
                window.location.href = paymentRes.data.url;
            } else {
                throw new Error('No payment URL received');
            }

        } catch (err) {
            console.error("Checkout Failed:", err);
            const msg = err.response?.data?.error || err.response?.data?.details || err.message || 'Something went wrong processing your order.';
            setError(`Payment Failed: ${msg}. Please try again.`);
            setIsSubmitting(false);
        }
    };

    if (step === 2) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
                <div style={{ width: '90px', height: '90px', background: '#DCFCE7', borderRadius: '50%', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <ShieldCheck size={48} />
                </div>
                <h1 style={{ marginBottom: '15px', fontSize: '2.5rem', fontWeight: '800' }}>Order Confirmed!</h1>
                <p style={{ color: '#6B7280', marginBottom: '40px', fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto 40px' }}>
                    Thank you for your payment.<br />
                    We have received your order and payment.
                </p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <button onClick={() => navigate('/')} className="btn btn-outline">Back to Home</button>
                    {user && <button onClick={() => navigate('/profile')} className="btn btn-primary">View My Orders</button>}
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '20px' }}>Your cart is empty</h2>
                <button onClick={() => navigate('/reparationer')} className="btn btn-primary">Browse Repairs</button>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '100vh', padding: '40px 0' }}>
            <div className="container">
                <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', marginBottom: '30px', color: 'var(--text-muted)', fontWeight: '500' }}>
                    <ChevronLeft size={20} /> Continue Shopping
                </button>

                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '40px', color: 'var(--text-main)' }}>Checkout</h1>

                {error && (
                    <div style={{ background: '#FEE2E2', border: '1px solid #F87171', color: '#B91C1C', padding: '15px', borderRadius: '8px', marginBottom: '30px' }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'start' }}>

                    {/* LEFT COLUMN: FORM */}
                    <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '0' }}>

                        {/* 1. Contact Info */}
                        <div className="card-glass" style={{ padding: '30px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                                <User className="text-primary" size={20} color="var(--primary)" /> Contact Details
                            </h3>

                            <div style={{ display: 'grid', gap: '20px' }}>
                                <div>
                                    <label className="form-label">Full Name</label>
                                    <div className="input-with-icon">
                                        <User size={18} className="icon" />
                                        <input
                                            required
                                            type="text"
                                            name="name"
                                            placeholder="John Doe"
                                            className="input-field"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label className="form-label">Email Address</label>
                                        <div className="input-with-icon">
                                            <Mail size={18} className="icon" />
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                placeholder="john@example.com"
                                                className="input-field"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="form-label">Phone Number</label>
                                        <div className="input-with-icon">
                                            <Phone size={18} className="icon" />
                                            <input
                                                required
                                                type="tel"
                                                name="phone"
                                                placeholder="+45 12 34 56 78"
                                                className="input-field"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Address Details */}
                        <div className="card-glass" style={{ padding: '30px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                                <MapPin className="text-primary" size={20} color="var(--primary)" /> Address & Notes
                            </h3>

                            <div style={{ display: 'grid', gap: '20px' }}>
                                <div>
                                    <label className="form-label">Street Address</label>
                                    <div className="input-with-icon">
                                        <Home size={18} className="icon" />
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="Street name and number"
                                            className="input-field"
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                                    <div>
                                        <label className="form-label">Postal Code</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            placeholder="1234"
                                            className="input-field"
                                            value={formData.postalCode}
                                            onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="Copenhagen"
                                            className="input-field"
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="form-label">Order Notes (Optional)</label>
                                    <div className="input-with-icon" style={{ alignItems: 'flex-start' }}>
                                        <FileText size={18} className="icon" style={{ marginTop: '12px' }} />
                                        <textarea
                                            className="input-field"
                                            style={{ minHeight: '100px', paddingTop: '10px', resize: 'vertical' }}
                                            placeholder="Door code, special instructions, etc."
                                            value={formData.notes}
                                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Shipping Method */}
                        <div className="card-glass" style={{ padding: '30px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                                <Truck className="text-primary" size={20} color="var(--primary)" /> Shipping Method
                            </h3>

                            <div style={{ display: 'grid', gap: '15px' }}>
                                {shippingOptions.map(option => (
                                    <label
                                        key={option.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '15px',
                                            border: selectedShipping?.id === option.id ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            background: selectedShipping?.id === option.id ? 'var(--bg-primary-light)' : 'var(--bg-input)'
                                        }}
                                        onClick={() => setSelectedShipping(option)}
                                    >
                                        <input
                                            type="radio"
                                            name="shipping"
                                            checked={selectedShipping?.id === option.id}
                                            onChange={() => setSelectedShipping(option)}
                                            style={{ marginRight: '12px' }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{option.name}</div>
                                        </div>
                                        <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                                            kr {option.price}
                                        </div>
                                    </label>
                                ))}
                            </div>

                            {/* Drop Point Selector */}
                            {dropPoints.length > 0 && (
                                <div style={{ marginTop: '20px' }}>
                                    <label className="form-label">Select Pickup Point</label>
                                    <select
                                        className="input-field"
                                        style={{ width: '100%' }}
                                        onChange={(e) => {
                                            const point = dropPoints.find(p => p.id === e.target.value);
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
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SUMMARY */}
                    <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '20px', minWidth: '0' }}>
                        <div className="card-glass" style={{ padding: '30px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '24px', color: 'var(--text-main)' }}>Order Summary</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                                {cart.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                                        <div>
                                            <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.modelName}</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.repairName}</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>kr {item.price}</span>
                                            <button
                                                onClick={() => removeFromCart(item.uniqueId)}
                                                style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                                                title="Remove item"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)' }}>
                                    <span>Subtotal</span>
                                    <span>kr {subtotal}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)' }}>
                                    <span>Shipping</span>
                                    <span>kr {selectedShipping ? selectedShipping.price : 0}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)' }}>
                                    <span>VAT (25%)</span>
                                    <span>kr {vat}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)', fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                                    <span>Total</span>
                                    <span>kr {total}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="btn btn-primary"
                                style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.1rem', pointerEvents: isSubmitting ? 'none' : 'auto', opacity: isSubmitting ? 0.7 : 1 }}
                            >
                                {isSubmitting ? 'Processing...' : (
                                    <>
                                        <CreditCard size={20} /> Confirm Order
                                    </>
                                )}
                            </button>

                            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                Secure online payment via Quickpay.
                            </p>
                        </div>

                        <div style={{ background: 'var(--bg-element)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                            <h4 style={{ color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldCheck size={18} /> Warranty Included
                            </h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                                All repairs come with our standard 24-month warranty on parts and labor.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
