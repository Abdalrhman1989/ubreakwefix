import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Smartphone, Wrench, Calendar, TrendingUp, Activity, User, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ brands: 0, models: 0, repairs: 0, bookings: 0 });
    const [revenueData, setRevenueData] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/stats').then(res => setStats(res.data));
        axios.get('/api/admin/analytics/revenue').then(res => setRevenueData(res.data));
        axios.get('/api/admin/analytics/activity').then(res => setRecentActivity(res.data));
        axios.get('/api/admin/bookings').then(res => setBookings(res.data));
    }, []);

    const cards = [
        { label: 'Total Brands', value: stats.brands, icon: <Package size={24} />, color: '#3B82F6' },
        { label: 'Total Models', value: stats.models, icon: <Smartphone size={24} />, color: '#10B981' },
        { label: 'Total Repairs', value: stats.repairs, icon: <Wrench size={24} />, color: '#F59E0B' },
        { label: 'Total Bookings', value: stats.bookings, icon: <Calendar size={24} />, color: '#6366F1' },
    ];

    const maxRevenue = Math.max(...revenueData.map(d => d.amount), 100);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '30px', color: 'var(--text-main)' }}>Dashboard Overview</h1>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                {cards.map((card, idx) => (
                    <div className="card-glass" key={idx} style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>{card.label}</p>
                                <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>{card.value}</h3>
                            </div>
                            <div style={{ padding: '12px', borderRadius: '12px', background: `${card.color}20`, color: card.color }}>
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

                {/* Revenue Chart */}
                <div className="card-glass" style={{ padding: '24px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                        <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#10B981' }}>
                            <TrendingUp size={20} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Revenue (Last 7 Days)</h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', gap: '12px', paddingBottom: '20px' }}>
                        {revenueData.map((d, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                <div
                                    style={{
                                        width: '100%',
                                        maxWidth: '40px',
                                        height: `${(d.amount / maxRevenue) * 100}%`,
                                        background: 'var(--primary)',
                                        borderRadius: '8px 8px 0 0',
                                        opacity: 0.8,
                                        transition: 'all 0.3s'
                                    }}
                                    title={`${d.amount} DKK`}
                                />
                                <span style={{ fontSize: '10px', marginTop: '8px', color: 'var(--text-muted)' }}>{d.date.slice(5)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card-glass" style={{ padding: '24px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                        <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: '#3B82F6' }}>
                            <Activity size={20} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Recent Activity</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {recentActivity.map((activity) => (
                            <div key={activity.id} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '50%',
                                    background: 'var(--bg-element)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--text-muted)', flexShrink: 0
                                }}>
                                    {activity.type === 'user' ? <User size={16} /> : activity.type === 'stock' ? <AlertCircle size={16} /> : <Activity size={16} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '500', margin: '0 0 2px 0' }}>{activity.message}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{activity.user} • {activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card-glass" style={{ marginTop: '40px', padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" onClick={() => window.location.href = '/admin/brands'}>Manage Brands</button>
                    <button className="btn btn-primary" onClick={() => window.location.href = '/admin/models'}>Manage Models</button>
                    <button className="btn btn-primary" onClick={() => window.location.href = '/admin/users'}>Manage Users</button>
                    <button className="btn btn-primary" onClick={() => window.location.href = '/admin/shop-orders'}>View Orders</button>
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="card-glass" style={{ marginTop: '24px', padding: '24px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                    <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', color: '#6366F1' }}>
                        <Calendar size={20} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>In-Store Bookings (Pay at Shop)</h3>
                </div>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Device</th>
                                <th>Problem</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.slice(0, 5).map(booking => (
                                <tr key={booking.id}>
                                    <td>{booking.booking_date}</td>
                                    <td>
                                        <div>{booking.customer_name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{booking.customer_phone}</div>
                                    </td>
                                    <td>{booking.device_model}</td>
                                    <td>{booking.problem}</td>
                                    <td>
                                        <span className={`status-badge ${booking.status?.toLowerCase() || 'pending'}`}>{booking.status || 'Pending'}</span>
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No bookings found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
