import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Package, Clock, Shield } from 'lucide-react';

const AdminUserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`/api/admin/users/${id}`);
                setUser(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching user:", err);
                setError('Failed to load user profile');
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading user profile...</div>;
    if (error) return <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444' }}>{error}</div>;
    if (!user) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>User not found</div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Link to="/admin/users" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '24px' }}>
                <ArrowLeft size={20} /> Back to Users
            </Link>

            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 8px 0' }}>{user.name}</h1>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            background: user.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                            color: user.role === 'admin' ? '#EF4444' : '#3B82F6'
                        }}>
                            {user.role === 'admin' ? 'Administrator' : 'Customer'}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            Member since {new Date(user.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                {/* CONTACT INFO */}
                <div className="card-glass" style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Shield size={20} color="var(--primary)" />
                        Contact Information
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)' }}>
                            <Mail size={18} color="var(--text-muted)" />
                            {user.email}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)' }}>
                            <Phone size={18} color="var(--text-muted)" />
                            {user.phone || 'No phone number'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)' }}>
                            <MapPin size={18} color="var(--text-muted)" />
                            {user.address || 'No address provided'}
                        </div>
                    </div>
                </div>

                {/* STATS */}
                <div className="card-glass" style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Package size={20} color="var(--primary)" />
                        Account Summary
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Orders</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{user.bookings ? user.bookings.length : 0}</div>
                        </div>
                        {/* More stats can be added here if available */}
                    </div>
                </div>
            </div>

            {/* ORDER HISTORY */}
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '20px' }}>Order History</h2>

            {user.bookings && user.bookings.length > 0 ? (
                <div className="card-glass" style={{ overflowX: 'auto', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
                    <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'var(--bg-element)', borderBottom: '1px solid var(--border-light)' }}>
                            <tr>
                                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>ID</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Date</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Device / Issue</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.bookings.map((booking) => (
                                <tr key={booking.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', color: 'var(--text-main)' }}>#{booking.id}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-main)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Calendar size={14} color="var(--text-muted)" />
                                            {new Date(booking.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: '500', color: 'var(--text-main)' }}>{booking.device_model}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{booking.problem}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            background:
                                                booking.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' :
                                                    booking.status === 'In Progress' ? 'rgba(59, 130, 246, 0.1)' :
                                                        'rgba(245, 158, 11, 0.1)',
                                            color:
                                                booking.status === 'Completed' ? '#10B981' :
                                                    booking.status === 'In Progress' ? '#3B82F6' :
                                                        '#F59E0B'
                                        }}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                    No orders found for this user.
                </div>
            )}
        </div>
    );
};

export default AdminUserProfile;
