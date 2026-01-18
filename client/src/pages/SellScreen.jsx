import React, { useState } from 'react';

const SellScreen = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        quantity: '',
        customerName: '',
        customerEmail: '',
        customerPhone: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/sell-screen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitted(true);
            } else {
                alert('Der skete en fejl. Prøv igen senere.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Der skete en fejl. Prøv igen senere.');
        }
    };

    return (
        <div style={{ padding: '80px 0', minHeight: '80vh', background: 'var(--bg-body)' }}>
            <div className="container">
                <div className="card-glass" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', textAlign: 'center', color: 'var(--text-main)' }}>Sælg Din Ødelagte Skærm</h1>
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '40px' }}>
                        Vi opkøber originale skærme med knust glas (LCD/OLED skal være intakt). Perfekt til både private og erhverv.
                    </p>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)' }}>Hvilke skærme har du?</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="F.eks. 5x iPhone 11 Pro original, 2x Samsung S21..."
                                    required
                                    className="form-input"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', minHeight: '100px' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)' }}>Antal i alt (cirka)</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    placeholder="Antal"
                                    className="form-input"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)' }}>Dine kontaktoplysninger</label>
                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    placeholder="Navn / Firmanavn"
                                    required
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', marginBottom: '10px' }}
                                />
                                <input
                                    type="email"
                                    name="customerEmail"
                                    value={formData.customerEmail}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', marginBottom: '10px' }}
                                />
                                <input
                                    type="tel"
                                    name="customerPhone"
                                    value={formData.customerPhone}
                                    onChange={handleChange}
                                    placeholder="Telefon"
                                    required
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ padding: '15px', fontSize: '1.1rem', marginTop: '10px' }}>
                                Send Forespørgsel
                            </button>
                        </form>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <h2 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Tak for din henvendelse!</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Vi kontakter dig snart vedrørende dine skærme.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellScreen;
