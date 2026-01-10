import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Settings, Mail, Phone, Lock, Calendar } from 'lucide-react';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        store_name: '',
        support_email: '',
        support_phone: '',
        maintenance_mode: false,
        holiday_mode: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await axios.get('/api/admin/settings');
            // MockDB returns settings object directly in our implementation, check if array or obj
            // If returns array [obj] or just obj
            const data = Array.isArray(res.data) ? res.data : res.data;
            setSettings(data || {});
            setLoading(false);
        } catch (error) {
            console.error('Error fetching settings:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.post('/api/admin/settings', settings);
            // Show success logic (e.g. toast) - for now just delay
            setTimeout(() => setSaving(false), 500);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error('Error saving settings:', error);
            setSaving(false);
            alert("Failed to save settings");
        }
    };

    if (loading) return <div>Loading settings...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                <div style={{ padding: '10px', background: 'var(--bg-element)', borderRadius: '12px' }}>
                    <Settings size={28} color="var(--primary)" />
                </div>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>Store Settings</h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Configure global application settings</p>
                </div>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* General Settings */}
                <div className="card-glass" style={{ padding: '24px', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>General Info</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Store Name</label>
                            <input
                                type="text"
                                name="store_name"
                                value={settings.store_name || ''}
                                onChange={handleChange}
                                className="glass-input"
                                style={{ width: '100%' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Mail size={16} /> Support Email
                                </label>
                                <input
                                    type="email"
                                    name="support_email"
                                    value={settings.support_email || ''}
                                    onChange={handleChange}
                                    className="glass-input"
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Phone size={16} /> Support Phone
                                </label>
                                <input
                                    type="text"
                                    name="support_phone"
                                    value={settings.support_phone || ''}
                                    onChange={handleChange}
                                    className="glass-input"
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Advanced Mode */}
                <div className="card-glass" style={{ padding: '24px', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>Operational Modes</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', color: '#EF4444' }}>
                                    <Lock size={20} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontWeight: '600' }}>Maintenance Mode</h4>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Temporarily disable the site for visitors.</p>
                                </div>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    name="maintenance_mode"
                                    checked={settings.maintenance_mode || false}
                                    onChange={handleChange}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ padding: '10px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', color: '#F59E0B' }}>
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontWeight: '600' }}>Holiday Mode</h4>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Show a banner that orders may be delayed.</p>
                                </div>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    name="holiday_mode"
                                    checked={settings.holiday_mode || false}
                                    onChange={handleChange}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary"
                        style={{ padding: '12px 32px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}
                    >
                        {saving ? 'Saving...' : <><Save size={20} /> Save Settings</>}
                    </button>
                </div>
            </form>

            <style>{`
                /* Switch Toggle Styles */
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 28px;
                }
                .switch input { 
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: var(--bg-element);
                    border: 1px solid var(--border-medium);
                    transition: .4s;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 20px;
                    width: 20px;
                    left: 4px;
                    bottom: 3px;
                    background-color: var(--text-muted);
                    transition: .4s;
                }
                input:checked + .slider {
                    background-color: var(--primary);
                    border-color: var(--primary);
                }
                input:checked + .slider:before {
                    transform: translateX(20px);
                    background-color: white;
                }
                .slider.round {
                    border-radius: 34px;
                }
                .slider.round:before {
                    border-radius: 50%;
                }
            `}</style>
        </div>
    );
};

export default AdminSettings;
