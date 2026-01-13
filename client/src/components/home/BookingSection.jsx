import React, { useState } from 'react';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { enUS, da } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const BookingSection = () => {
    const { t, language } = useLanguage();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', device: '', problem: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const locale = language === 'da' ? da : enUS;

    const timeSlots = [
        '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];

    const nextMonth = () => setCurrentMonth(addDays(currentMonth, 30));
    const prevMonth = () => setCurrentMonth(addDays(currentMonth, -30));

    const onDateClick = (day) => {
        setSelectedDate(day);
        setSelectedTime(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3001/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    customerName: form.name,
                    customerEmail: form.email,
                    customerPhone: form.phone,
                    deviceModel: form.device,
                    date: `${format(selectedDate, 'yyyy-MM-dd')} ${selectedTime}`
                })
            });
            if (res.ok) {
                setSuccess(true);
                setForm({ name: '', email: '', phone: '', device: '', problem: '' });
                setSelectedTime(null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Calendar Generation
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale });
    const endDate = endOfWeek(monthEnd, { locale });
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']; // Simple headers

    return (
        <section style={{ padding: '80px 0', background: 'var(--bg-body)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h2 className="section-title">{t('booking.title')}</h2>
                    <p className="section-subtitle">{t('booking.subtitle')}</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '40px',
                    background: 'white',
                    borderRadius: '24px',
                    padding: '40px',
                    boxShadow: 'var(--shadow-lg)'
                }}>

                    {/* Left: Calendar & Time */}
                    <div>
                        {/* Calendar Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
                                {format(currentMonth, 'MMMM yyyy', { locale })}
                            </h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={prevMonth} style={navBtnStyle}><ChevronLeft size={20} /></button>
                                <button onClick={nextMonth} style={navBtnStyle}><ChevronRight size={20} /></button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginBottom: '30px' }}>
                            {weekDays.map((d, i) => (
                                <div key={i} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem', color: '#94a3b8' }}>{d}</div>
                            ))}
                            {calendarDays.map((day, i) => (
                                <div key={i}
                                    onClick={() => onDateClick(day)}
                                    style={{
                                        aspectRatio: '1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        background: isSameDay(day, selectedDate) ? 'var(--primary)' : 'transparent',
                                        color: isSameDay(day, selectedDate) ? 'white' : (isSameMonth(day, monthStart) ? 'var(--text-main)' : '#cbd5e1'),
                                        fontWeight: isToday(day) ? 'bold' : 'normal',
                                        border: isToday(day) && !isSameDay(day, selectedDate) ? '1px solid var(--primary)' : 'none'
                                    }}>
                                    {format(day, 'd')}
                                </div>
                            ))}
                        </div>

                        {/* Time Slots */}
                        <h4 style={{ fontSize: '1rem', marginBottom: '15px' }}>{t('booking.selectTime')}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: '10px' }}>
                            {timeSlots.map(time => (
                                <button key={time}
                                    onClick={() => setSelectedTime(time)}
                                    style={{
                                        padding: '8px',
                                        borderRadius: '8px',
                                        border: selectedTime === time ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                                        background: selectedTime === time ? 'rgba(37, 99, 235, 0.1)' : 'white',
                                        color: selectedTime === time ? 'var(--primary)' : '#64748b',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '0.9rem'
                                    }}>
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div style={{ paddingLeft: '20px', borderLeft: '1px solid #f1f5f9' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '25px' }}>{t('booking.yourDetails')}</h3>

                        {!success ? (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={labelStyle}>{t('booking.name')}</label>
                                    <input required type="text" style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={labelStyle}>{t('booking.email')}</label>
                                        <input required type="email" style={inputStyle} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>{t('booking.phone')}</label>
                                        <input required type="tel" style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>{t('booking.device')}</label>
                                    <input required type="text" style={inputStyle} value={form.device} onChange={e => setForm({ ...form, device: e.target.value })} />
                                </div>
                                <div>
                                    <label style={labelStyle}>{t('booking.issue')}</label>
                                    <textarea required rows="3" style={inputStyle} value={form.problem} onChange={e => setForm({ ...form, problem: e.target.value })} />
                                </div>

                                <div style={{ marginTop: '10px', padding: '15px', background: '#f8fafc', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem', marginBottom: '5px' }}>
                                        <Calendar size={16} /> <span>{format(selectedDate, 'PPP', { locale })}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}>
                                        <Clock size={16} /> <span>{selectedTime || '--:--'}</span>
                                    </div>
                                </div>

                                <button type="submit" disabled={!selectedTime || loading} className="btn btn-primary" style={{ width: '100%', marginTop: '10px', opacity: (!selectedTime || loading) ? 0.7 : 1 }}>
                                    {loading ? '...' : t('booking.submit')}
                                </button>
                            </form>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#10b981' }}>
                                <CheckCircle size={64} style={{ marginBottom: '20px' }} />
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Excellent!</h3>
                                <p style={{ color: '#64748b' }}>{t('booking.success')}</p>
                                <button onClick={() => setSuccess(false)} className="btn btn-secondary" style={{ marginTop: '30px' }}>Book Another</button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
};

const navBtnStyle = {
    background: '#f1f5f9',
    border: 'none',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748b'
};

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: '#fcfcfc'
};

const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#334155'
};

export default BookingSection;
