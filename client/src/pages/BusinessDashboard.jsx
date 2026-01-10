import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Wrench, Package, ArrowRight, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const BusinessDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'business') {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user || user.role !== 'business') return null;

    return (
        <div style={{ padding: '60px 0', minHeight: '80vh', background: 'var(--bg-body)' }}>
            <div className="container">
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '10px' }}>
                        Welcome, {user.name}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                        B2B Portal - Access your exclusive pricing and services.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '25px',
                    marginBottom: '40px'
                }}>
                    {/* Status Card */}
                    <div className="card-glass" style={{ padding: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                            <div style={{ background: '#dcfce7', padding: '12px', borderRadius: '12px', color: '#166534' }}>
                                <User size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Account Status</h3>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534', marginBottom: '5px' }}>Active</div>
                        <p style={{ color: 'var(--text-muted)' }}>Verified Business Partner</p>
                    </div>

                    {/* Pricing Card */}
                    <div className="card-glass" style={{ padding: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                            <div style={{ background: '#dbeafe', padding: '12px', borderRadius: '12px', color: '#1e40af' }}>
                                <Package size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>B2B Pricing</h3>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '5px' }}>Unlocked</div>
                        <p style={{ color: 'var(--text-muted)' }}>Wholesale rates applied automatically</p>
                    </div>
                </div>

                <h2 style={{ fontSize: '1.8rem', marginBottom: '25px', color: 'var(--text-main)' }}>Quick Actions</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
                    <Link to="/reparationer" style={{ textDecoration: 'none' }}>
                        <div className="card-hover" style={{
                            background: 'var(--bg-surface)',
                            padding: '30px',
                            borderRadius: '20px',
                            border: '1px solid var(--border-light)',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Wrench size={40} color="var(--primary)" style={{ marginBottom: '20px' }} />
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'var(--text-main)' }}>Book Repair</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', flex: 1 }}>
                                Schedule priority repairs for your company devices.
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 'bold' }}>
                                Start Booking <ArrowRight size={18} />
                            </div>
                        </div>
                    </Link>

                    <Link to="/shop" style={{ textDecoration: 'none' }}>
                        <div className="card-hover" style={{
                            background: 'var(--bg-surface)',
                            padding: '30px',
                            borderRadius: '20px',
                            border: '1px solid var(--border-light)',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <ShoppingBag size={40} color="var(--primary)" style={{ marginBottom: '20px' }} />
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'var(--text-main)' }}>Shop Equipment</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', flex: 1 }}>
                                Purchase accessories and parts at B2B rates.
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 'bold' }}>
                                Go to Shop <ArrowRight size={18} />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BusinessDashboard;
