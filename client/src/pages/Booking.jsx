import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Smartphone, User, Mail, Phone, FileText, CheckCircle, ArrowLeft, Clock } from 'lucide-react';

const Booking = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const location = useLocation();

    // Check for pre-filled data from router state
    const prefill = location.state || {};

    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        deviceModel: prefill.deviceModel || '',
        problem: prefill.problem || '',
        estimatedPrice: prefill.price || 0,
        date: '',
        time: '',
        isPriority: prefill.isPriority || false
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

    const [status, setStatus] = useState('idle');

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
                navigate('/profile');
            }, 3000);
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                    width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px'
                }}>
                    <CheckCircle size={50} color="#10b981" />
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '15px' }}>Booking Bekræftet!</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '500px' }}>
                    Vi har modtaget din reservation. Du modtager en bekræftelse på email om et øjeblik.
                </p>
                <div style={{ marginTop: '30px', color: 'var(--primary)' }}>Sender dig til din profil...</div>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '100vh', padding: '40px 0 80px' }}>
            <div className="container">

                <div style={{ marginBottom: '40px' }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '20px' }}>
                        <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Tilbage til forsiden
                    </Link>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800' }}>Book <span style={{ color: 'var(--primary)' }}>Reparation</span></h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px' }}>
                        Vælg en tid der passer dig, så står vi klar til at fikse din enhed med det samme.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
                    <div className="card-glass" style={{ padding: '40px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)' }}>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>

                                {/* Personal Info Section */}
                                <div>
                                    <h3 style={{ fontSize: '1.3rem', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <User size={20} color="var(--primary)" /> Dine Oplysninger
                                    </h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div className="input-group">
                                            <label htmlFor="customerName" className="form-label" style={{ fontWeight: '600', marginLeft: '5px' }}>Navn</label>
                                            <div style={{ position: 'relative' }}>
                                                <User size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                                <input
                                                    id="customerName"
                                                    type="text" name="customerName" required
                                                    value={formData.customerName} onChange={handleChange}
                                                    className="input-field"
                                                    style={{ paddingLeft: '45px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)' }}
                                                    placeholder="Dit fulde navn"
                                                />
                                            </div>
                                        </div>

                                        <div className="input-group">
                                            <label htmlFor="customerEmail" className="form-label" style={{ fontWeight: '600', marginLeft: '5px' }}>Email</label>
                                            <div style={{ position: 'relative' }}>
                                                <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                                <input
                                                    id="customerEmail"
                                                    type="email" name="customerEmail" required
                                                    value={formData.customerEmail} onChange={handleChange}
                                                    className="input-field"
                                                    style={{ paddingLeft: '45px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)' }}
                                                    placeholder="din@email.dk"
                                                />
                                            </div>
                                        </div>

                                        <div className="input-group">
                                            <label htmlFor="customerPhone" className="form-label" style={{ fontWeight: '600', marginLeft: '5px' }}>Telefon</label>
                                            <div style={{ position: 'relative' }}>
                                                <Phone size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                                <input
                                                    id="customerPhone"
                                                    type="tel" name="customerPhone" required
                                                    value={formData.customerPhone} onChange={handleChange}
                                                    className="input-field"
                                                    style={{ paddingLeft: '45px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)' }}
                                                    placeholder="+45 12 34 56 78"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Repair Info Section */}
                                <div>
                                    <h3 style={{ fontSize: '1.3rem', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Smartphone size={20} color="var(--primary)" /> Reparation & Tid
                                    </h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div className="input-group">
                                            <label htmlFor="deviceModel" className="form-label" style={{ fontWeight: '600', marginLeft: '5px' }}>Enhed</label>
                                            <div style={{ position: 'relative' }}>
                                                <Smartphone size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                                <input
                                                    id="deviceModel"
                                                    type="text" name="deviceModel" required
                                                    value={formData.deviceModel} onChange={handleChange}
                                                    className="input-field"
                                                    style={{ paddingLeft: '45px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)' }}
                                                    placeholder="F.eks. iPhone 13 Pro"
                                                />
                                            </div>
                                        </div>

                                        <div className="input-group">
                                            <label htmlFor="problem" className="form-label" style={{ fontWeight: '600', marginLeft: '5px' }}>Beskrivelse</label>
                                            <div style={{ position: 'relative' }}>
                                                <FileText size={18} style={{ position: 'absolute', left: '15px', top: '20px', color: 'var(--text-muted)' }} />
                                                <textarea
                                                    id="problem"
                                                    name="problem" rows="3" required
                                                    value={formData.problem} onChange={handleChange}
                                                    className="input-field"
                                                    style={{ paddingLeft: '45px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', minHeight: '100px' }}
                                                    placeholder="Hvad er problemet? F.eks. smadret skærm..."
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="input-group">
                                            <label htmlFor="date" className="form-label" style={{ fontWeight: '600', marginLeft: '5px' }}>Ønsket Dato</label>
                                            <div style={{ position: 'relative' }}>
                                                <Calendar size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                                <input
                                                    id="date"
                                                    type="date" name="date" required
                                                    value={formData.date} onChange={handleChange}
                                                    className="input-field"
                                                    style={{ paddingLeft: '45px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)' }}
                                                />
                                            </div>
                                        </div>

                                        <div className="input-group">
                                            <label htmlFor="time" className="form-label" style={{ fontWeight: '600', marginLeft: '5px' }}>Tidspunkt</label>
                                            <div style={{ position: 'relative' }}>
                                                <Clock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                                <input
                                                    id="time"
                                                    type="time" name="time" required
                                                    value={formData.time} onChange={handleChange}
                                                    className="input-field"
                                                    style={{ paddingLeft: '45px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: '40px', padding: '18px', fontSize: '1.2rem', borderRadius: '12px' }}
                                disabled={status === 'submitting'}
                            >
                                {status === 'submitting' ? 'Bekræfter tid...' : 'Bekræft Booking'}
                            </button>

                            {status === 'error' && (
                                <div style={{ color: '#ef4444', marginTop: '20px', textAlign: 'center', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                                    Der opstod en fejl. Prøv venligst igen senere.
                                </div>
                            )}

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
