import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Shield, User, Mail, Phone, MapPin, Save, Lock } from 'lucide-react';

const AdminProfile = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [message, setMessage] = useState({ text: '', type: '' });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/users/${user.id}`, formData);
            setMessage({ text: 'Profile updated successfully!', type: 'success' });
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            console.error(error);
            setMessage({ text: 'Failed to update profile', type: 'error' });
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ text: "New passwords do not match", type: 'error' });
            return;
        }

        try {
            await axios.put(`/api/users/${user.id}/password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setMessage({ text: 'Password changed successfully!', type: 'success' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error(error);
            setMessage({ text: error.response?.data?.error || 'Failed to change password', type: 'error' });
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', color: 'var(--text-main)' }}>My Profile</h1>

            {message.text && (
                <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: message.type === 'success' ? '#10B981' : '#EF4444',
                    border: `1px solid ${message.type === 'success' ? '#10B981' : '#EF4444'}`
                }}>
                    {message.text}
                </div>
            )}

            <div style={{ display: 'grid', gap: '30px' }}>
                {/* Profile Information */}
                <div className="card-glass" style={{ padding: '30px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                        <User size={20} className="text-primary" /> Personal Information
                    </h2>
                    <form onSubmit={handleProfileUpdate} style={{ display: 'grid', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-search"
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-body)', color: 'var(--text-main)' }}
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Phone</label>
                                <input
                                    type="tel"
                                    className="input-search"
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-body)', color: 'var(--text-main)' }}
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Email</label>
                            <input
                                type="email"
                                required
                                className="input-search"
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-body)', color: 'var(--text-main)' }}
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Address</label>
                            <textarea
                                rows="2"
                                className="input-search"
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-body)', color: 'var(--text-main)' }}
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Change */}
                <div className="card-glass" style={{ padding: '30px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                        <Shield size={20} className="text-primary" /> Security
                    </h2>
                    <form onSubmit={handlePasswordChange} style={{ display: 'grid', gap: '20px', maxWidth: '400px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Current Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    required
                                    style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-body)', color: 'var(--text-main)' }}
                                    value={passwordData.currentPassword}
                                    onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>New Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    required
                                    style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-body)', color: 'var(--text-main)' }}
                                    value={passwordData.newPassword}
                                    onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Confirm New Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    required
                                    style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-body)', color: 'var(--text-main)' }}
                                    value={passwordData.confirmPassword}
                                    onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <button type="submit" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderColor: 'var(--border-medium)', color: 'var(--text-main)' }}>
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
