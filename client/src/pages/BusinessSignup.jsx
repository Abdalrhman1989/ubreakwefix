import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';

const BusinessSignup = () => {
    const [formData, setFormData] = useState({ companyName: '', cvr: '', email: '', phone: '', address: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/business/signup', formData);
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert('Der skete en fejl. Prøv igen.');
        }
    };

    if (submitted) {
        return (
            <div style={{ padding: '100px 0', textAlign: 'center', minHeight: '60vh' }}>
                <div style={{ background: 'var(--bg-surface)', padding: '60px', borderRadius: '24px', display: 'inline-block', boxShadow: 'var(--shadow-lg)' }}>
                    <CheckCircle size={80} color="var(--primary)" style={{ marginBottom: '20px' }} />
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Ansøgning Modtaget!</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                        Tak for din interesse. Vi behandler din ansøgning hurtigst muligt<br />og kontakter dig inden for 24 timer.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '60px 0', background: 'var(--bg-body)', minHeight: '80vh' }}>
            <div className="container" style={{ maxWidth: '600px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Opret Erhvervskonto</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Få adgang til fordelspriser og prioriteret service.</p>
                </div>

                <form onSubmit={handleSubmit} className="card-glass" style={{ padding: '40px' }}>
                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Virksomhedsnavn</label>
                            <input
                                type="text"
                                required
                                className="input-search"
                                style={{ borderRadius: '8px', padding: '12px' }}
                                value={formData.companyName}
                                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>CVR-nummer</label>
                            <input
                                type="text"
                                required
                                className="input-search"
                                style={{ borderRadius: '8px', padding: '12px' }}
                                value={formData.cvr}
                                onChange={e => setFormData({ ...formData, cvr: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email</label>
                            <input
                                type="email"
                                required
                                className="input-search"
                                style={{ borderRadius: '8px', padding: '12px' }}
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Telefon</label>
                            <input
                                type="tel"
                                required
                                className="input-search"
                                style={{ borderRadius: '8px', padding: '12px' }}
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Adresse</label>
                            <input
                                type="text"
                                required
                                className="input-search"
                                style={{ borderRadius: '8px', padding: '12px' }}
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginTop: '20px' }}>
                            Send Ansøgning
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BusinessSignup;
