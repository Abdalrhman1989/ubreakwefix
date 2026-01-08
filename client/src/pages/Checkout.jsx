import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShieldCheck, CreditCard } from 'lucide-react';

const Checkout = () => {
    const { cart, removeFromCart, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Review, 2: Details, 3: Success
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

    const total = getCartTotal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setStep(3);
        clearCart();
    };

    if (step === 3) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
                <div style={{ width: '80px', height: '80px', background: '#DCFCE7', borderRadius: '50%', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' }}>
                    <ShieldCheck size={40} />
                </div>
                <h1 style={{ marginBottom: '20px' }}>Tak for din bestilling!</h1>
                <p style={{ color: '#6B7280', marginBottom: '40px', fontSize: '1.2rem' }}>
                    Vi har sendt en bekræftelse til <strong>{formData.email}</strong>.<br />
                    Vi glæder os til at se dig i butikken.
                </p>
                <button onClick={() => navigate('/')} className="btn btn-primary">Tilbage til forsiden</button>
            </div>
        );
    }

    if (cart.length === 0 && step !== 3) {
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <h2>Din kurv er tom</h2>
                <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '20px' }}>Find reparation</button>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '60px 20px', minHeight: '80vh' }}>
            <h1 className="title-section" style={{ textAlign: 'left' }}>Checkout</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '60px' }}>

                {/* LEFT COLUMN - STEPS */}
                <div>
                    {/* Step 1: Items */}
                    <div className="card-float" style={{ marginBottom: '30px', opacity: step === 1 ? 1 : 0.6 }}>
                        <h3 style={{ marginBottom: '20px' }}>1. Din ordre</h3>
                        {cart.map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <div>
                                    <div style={{ fontWeight: '600' }}>{item.repairName}</div>
                                    <div style={{ color: '#6B7280', fontSize: '0.9rem' }}>{item.modelName}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <span style={{ fontWeight: '600' }}>kr {item.price}</span>
                                    {step === 1 && (
                                        <button onClick={() => removeFromCart(item.uniqueId)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Step 2: Customer Info */}
                    {step >= 2 && (
                        <div className="card-float">
                            <h3 style={{ marginBottom: '20px' }}>2. Dine oplysninger</h3>
                            <form id="checkout-form" onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                    <input required placeholder="Navn" className="input-clean" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    <input required placeholder="Telefon" className="input-clean" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                                <input required placeholder="Email" type="email" className="input-clean" style={{ marginBottom: '20px' }} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                <textarea placeholder="Evt. kommentar (Adresse hvis afhentning)" className="input-clean" style={{ minHeight: '100px', borderRadius: '20px' }} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}></textarea>
                            </form>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN - SUMMARY */}
                <div>
                    <div className="card-float" style={{ position: 'sticky', top: '120px' }}>
                        <h3 style={{ marginBottom: '30px' }}>Oversigt</h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <span style={{ color: '#6B7280' }}>Subtotal</span>
                            <span>kr {Math.round(total * 0.8)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                            <span style={{ color: '#6B7280' }}>Moms (25%)</span>
                            <span>kr {total - Math.round(total * 0.8)}</span>
                        </div>

                        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold' }}>
                            <span>Total</span>
                            <span>kr {total}</span>
                        </div>

                        {step === 1 ? (
                            <button onClick={() => setStep(2)} className="btn btn-primary" style={{ width: '100%' }}>
                                Gå til betaling
                            </button>
                        ) : (
                            <button type="submit" form="checkout-form" className="btn btn-accent" style={{ width: '100%', display: 'flex', gap: '10px' }}>
                                <CreditCard size={20} /> Bekræft bestilling
                            </button>
                        )}

                        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: '#9CA3AF' }}>
                            Betaling sker først ved afhentning i butikken.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
