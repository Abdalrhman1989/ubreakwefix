import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Smartphone, Wrench, Calendar } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ brands: 0, models: 0, repairs: 0, bookings: 0 });

    useEffect(() => {
        axios.get('/api/admin/stats').then(res => setStats(res.data));
    }, []);

    const cards = [
        { label: 'Total Brands', value: stats.brands, icon: <Package size={24} />, color: '#3B82F6' },
        { label: 'Total Models', value: stats.models, icon: <Smartphone size={24} />, color: '#10B981' },
        { label: 'Total Repairs', value: stats.repairs, icon: <Wrench size={24} />, color: '#F59E0B' },
        { label: 'Total Bookings', value: stats.bookings, icon: <Calendar size={24} />, color: '#6366F1' },
    ];

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '30px', color: 'var(--text-main)' }}>Dashboard Overview</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
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

            <div className="card-glass" style={{ marginTop: '40px', background: 'var(--bg-surface)', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-main)' }}>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button className="btn btn-primary" onClick={() => window.location.href = '/admin/brands'}>Manage Brands</button>
                    <button className="btn btn-primary" onClick={() => window.location.href = '/admin/models'}>Manage Models</button>
                    <button className="btn btn-primary" onClick={() => window.location.href = '/admin/users'}>Manage Users</button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
