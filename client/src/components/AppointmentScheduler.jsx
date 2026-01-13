import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, ChevronRight } from 'lucide-react';

const AppointmentScheduler = () => {
    const { t } = useLanguage();
    const [step, setStep] = useState(1); // 1: Date/Time, 2: Details, 3: Success
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [details, setDetails] = useState({
        name: '',
        email: '',
        phone: '',
        reason: ''
    });
    const [loading, setLoading] = useState(false);

    // Generate time slots 10:00 - 17:30
    const timeSlots = [];
    for (let h = 10; h <= 17; h++) {
        timeSlots.push(`${h}:00`);
        if (h !== 17) timeSlots.push(`${h}:30`); // No 17:30 booking if close at 18:00? let's allow it for quick pickup
    }

    const handleBook = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:3001/api/bookings', {
                customerName: details.name,
                customerEmail: details.email,
                customerPhone: details.phone,
                deviceModel: 'Butiksbesøg', // Special flag
                problem: `Booket tid: ${date} kl. ${time}. Årsag: ${details.reason}`,
                date: `${date} ${time}`
            });
            setStep(3);
        } catch (err) {
            console.error(err);
            alert(t('contactPage.form.error'));
        } finally {
            setLoading(false);
        }
    };

    if (step === 3) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <CheckCircle size={64} color="var(--primary)" style={{ margin: '0 auto 20px' }} />
                <h3>{t('contactPage.scheduler.successTitle')}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                    {t('contactPage.scheduler.successText')} <strong>{date}</strong> kl. <strong>{time}</strong>.
                </p>
                <button onClick={() => { setStep(1); setDate(''); setTime(''); }} className="btn btn-outline">
                    {t('contactPage.scheduler.bookNew')}
                </button>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                <span style={{ color: step >= 1 ? 'var(--primary)' : 'inherit', fontWeight: step >= 1 ? 'bold' : 'normal' }}>{t('contactPage.scheduler.step1')}</span>
                <ChevronRight size={14} />
                <span style={{ color: step >= 2 ? 'var(--primary)' : 'inherit', fontWeight: step >= 2 ? 'bold' : 'normal' }}>{t('contactPage.scheduler.step2')}</span>
            </div>

            {step === 1 && (
                <div className="fade-in">
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>{t('contactPage.scheduler.selectDate')}</label>
                    <input
                        type="date"
                        className="input-field"
                        style={{ width: '100%', padding: '12px', marginBottom: '20px' }}
                        min={new Date().toISOString().split('T')[0]}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>{t('contactPage.scheduler.selectTime')}</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px' }}>
                        {timeSlots.map(slot => (
                            <button
                                key={slot}
                                onClick={() => setTime(slot)}
                                style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: time === slot ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                                    background: time === slot ? 'var(--primary-light)' : 'var(--bg-surface)',
                                    color: time === slot ? 'var(--primary)' : 'var(--text-main)',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>

                    <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            className="btn btn-primary"
                            disabled={!date || !time}
                            onClick={() => setStep(2)}
                        >
                            {t('contactPage.scheduler.next')}
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ background: 'var(--bg-body)', padding: '15px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Clock size={18} className="text-muted" />
                        <span><strong>{date}</strong> kl. <strong>{time}</strong></span>
                        <button style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setStep(1)}>Ændr</button>
                    </div>

                    <div>
                        <label>{t('contactPage.scheduler.detailsName')}</label>
                        <div className="input-with-icon">
                            <User size={18} />
                            <input type="text" placeholder={t('contactPage.scheduler.detailsName')} value={details.name} onChange={e => setDetails({ ...details, name: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label>{t('contactPage.scheduler.detailsEmail')}</label>
                        <div className="input-with-icon">
                            <Mail size={18} />
                            <input type="email" placeholder={t('contactPage.scheduler.detailsEmail')} value={details.email} onChange={e => setDetails({ ...details, email: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label>{t('contactPage.scheduler.detailsPhone')}</label>
                        <div className="input-with-icon">
                            <Phone size={18} />
                            <input type="tel" placeholder={t('contactPage.scheduler.detailsPhone')} value={details.phone} onChange={e => setDetails({ ...details, phone: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label>{t('contactPage.scheduler.detailsReason')}</label>
                        <input type="text" className="input-field" placeholder={t('contactPage.scheduler.detailsReasonPlaceholder')} value={details.reason} onChange={e => setDetails({ ...details, reason: e.target.value })} style={{ width: '100%', padding: '12px' }} />
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                        <button className="btn btn-outline" onClick={() => setStep(1)} style={{ flex: 1 }}>{t('contactPage.scheduler.back')}</button>
                        <button
                            className="btn btn-primary"
                            disabled={!details.name || !details.email || !details.phone || loading}
                            onClick={handleBook}
                            style={{ flex: 2 }}
                        >
                            {loading ? t('contactPage.scheduler.booking') : t('contactPage.scheduler.confirm')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentScheduler;

