import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Booking = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        deviceModel: '',
        problem: '',
        date: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                customerName: user.name || '',
                customerEmail: user.email || '',
                customerPhone: user.phone || ''
            }));
        }
    }, [user]);

    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            const dataToSend = { ...formData, userId: user ? user.id : null };
            await axios.post('/api/bookings', dataToSend);
            setStatus('success');
            setTimeout(() => {
                navigate('/profile'); // Redirect to profile to see the order
            }, 2000);
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
                <div style={{ color: 'green', fontSize: '4rem', marginBottom: '20px' }}>✓</div>
                <h2>Tak for din bestilling!</h2>
                <p>Vi har modtaget din booking. Du hører fra os snarest.</p>
                <p>Sender dig tilbage til forsiden...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '30px', color: 'var(--primary-blue)' }}>Book Reparation</h1>

            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div className="form-group">
                    <label htmlFor="customerName" className="form-label">Fulde Navn</label>
                    <input id="customerName" type="text" name="customerName" className="form-select" required onChange={handleChange} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                        <label htmlFor="customerEmail" className="form-label">Email</label>
                        <input id="customerEmail" type="email" name="customerEmail" className="form-select" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="customerPhone" className="form-label">Telefon</label>
                        <input id="customerPhone" type="tel" name="customerPhone" className="form-select" required onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="deviceModel" className="form-label">Hvilken enhed drejer det sig om? (Mærke & Model)</label>
                    <input id="deviceModel" type="text" name="deviceModel" className="form-select" placeholder="F.eks. iPhone 13 Pro" required onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="problem" className="form-label">Beskriv problemet</label>
                    <textarea id="problem" name="problem" className="form-select" rows="4" placeholder="F.eks. Skærmen er sort..." required onChange={handleChange}></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="date" className="form-label">Ønsket dato</label>
                    <input id="date" type="date" name="date" className="form-select" required onChange={handleChange} />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }} disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Sender...' : 'Bekræft Booking'}
                </button>

                {status === 'error' && (
                    <div style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>
                        Der opstod en fejl. Prøv venligst igen eller kontakt os på telefon.
                    </div>
                )}
            </form>
        </div>
    );
};

export default Booking;
