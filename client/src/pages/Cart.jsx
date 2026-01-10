import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    // Simple Checkout Form State
    const [customer, setCustomer] = useState({
        name: user?.name || '',
        email: user?.email || '',
        address: user?.address || '',
        city: '',
        zip: ''
    });

    const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' or 'info'

    const total = getCartTotal();

    const handleCheckout = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const orderData = {
                userId: user?.id,
                customerName: customer.name,
                customerEmail: customer.email,
                totalAmount: total,
                items: cartItems
            };

            const res = await axios.post('/api/shop/orders', orderData);
            if (res.data.id) {
                alert('Order placed successfully! Check your email.');
                clearCart();
                navigate('/shop');
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert('Failed to place order.');
        } finally {
            setSubmitting(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--text-main)' }}>Your cart is empty</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Looks like you haven't added any items yet.</p>
                <Link to="/shop" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', padding: '12px 30px', borderRadius: '25px' }}>
                    Go to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '60px 20px', minHeight: '80vh' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '40px', color: 'var(--text-main)' }}>
                {checkoutStep === 'cart' ? 'Shopping Cart' : 'Checkout'}
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px', alignItems: 'start' }}>

                {/* Left Column: Items or Form */}
                <div style={{ background: 'var(--bg-surface)', padding: '30px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>

                    {checkoutStep === 'cart' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {cartItems.map(item => (
                                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
                                    <img src={item.image_url} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'contain', background: '#f5f5f7', borderRadius: '8px', padding: '5px' }} />

                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '5px' }}>{item.name}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.price} DKK</p>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: 'var(--bg-element)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={14} /></button>
                                        <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: 'var(--bg-element)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={14} /></button>
                                    </div>

                                    <div style={{ fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>
                                        {(item.price * item.quantity).toFixed(0)} DKK
                                    </div>

                                    <button onClick={() => removeFromCart(item.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <form id="checkout-form" onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Full Name</label>
                                <input
                                    required
                                    type="text"
                                    value={customer.name}
                                    onChange={e => setCustomer({ ...customer, name: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-element)', color: 'var(--text-main)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
                                <input
                                    required
                                    type="email"
                                    value={customer.email}
                                    onChange={e => setCustomer({ ...customer, email: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-element)', color: 'var(--text-main)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Address</label>
                                <input
                                    required
                                    type="text"
                                    value={customer.address}
                                    onChange={e => setCustomer({ ...customer, address: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-element)', color: 'var(--text-main)' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>City</label>
                                    <input
                                        required
                                        type="text"
                                        value={customer.city}
                                        onChange={e => setCustomer({ ...customer, city: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-element)', color: 'var(--text-main)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Zip Code</label>
                                    <input
                                        required
                                        type="text"
                                        value={customer.zip}
                                        onChange={e => setCustomer({ ...customer, zip: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-element)', color: 'var(--text-main)' }}
                                    />
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                {/* Right Column: Summary */}
                <div style={{ background: 'var(--bg-surface)', padding: '30px', borderRadius: '16px', border: '1px solid var(--border-light)', position: 'sticky', top: '100px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--text-main)' }}>Order Summary</h3>

                    <div style={{ spaceY: '10px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                            <span>{total.toFixed(0)} DKK</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                            <span>0 DKK</span>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border-light)', margin: '15px 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                            <span>Total</span>
                            <span>{total.toFixed(0)} DKK</span>
                        </div>
                    </div>

                    {checkoutStep === 'cart' ? (
                        <button
                            onClick={() => setCheckoutStep('info')}
                            className="btn-primary"
                            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                        >
                            Proceed to Checkout <ArrowRight size={18} />
                        </button>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={submitting}
                                className="btn-primary"
                                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '1rem', opacity: submitting ? 0.7 : 1 }}
                            >
                                {submitting ? 'Processing...' : 'Place Order'}
                            </button>
                            <button
                                onClick={() => setCheckoutStep('cart')}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '10px' }}
                            >
                                Back to Cart
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
