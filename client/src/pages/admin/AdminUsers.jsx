import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Shield, User, Search, Mail, Phone, MapPin, Eye } from 'lucide-react';

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    // ... (rest of code)
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user', // 'admin' or 'user'
        phone: '',
        address: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const [error, setError] = useState(null);

    const fetchUsers = () => {
        setLoading(true);
        axios.get('/api/admin/users')
            .then(res => setUsers(res.data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`/api/admin/users/${id}`);
            fetchUsers();
        } catch (error) {
            console.error("Failed to delete user", error);
            alert("Failed to delete user");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/users', formData);
            setShowForm(false);
            setFormData({ name: '', email: '', password: '', role: 'user', phone: '', address: '' });
            fetchUsers();
        } catch (error) {
            console.error("Failed to create user", error);
            alert("Failed to create user");
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>User Management</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        padding: '10px 20px',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: '600'
                    }}
                >
                    <Plus size={20} /> Add User
                </button>
            </div>

            {/* CREATE FORM */}
            {showForm && (
                <div className="card-glass" style={{
                    padding: '24px', marginBottom: '30px', background: 'var(--bg-surface)',
                    border: '1px solid var(--border-light)'
                }}>
                    <h3 style={{ marginBottom: '20px', color: 'var(--text-main)' }}>Create New User</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div style={{ gridColumn: '1/-1', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-search"
                                    style={{ width: '100%', padding: '10px', fontSize: '0.9rem', borderRadius: '8px', border: '1px solid var(--border-medium)' }}
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Email</label>
                                <input
                                    type="email"
                                    required
                                    className="input-search"
                                    style={{ width: '100%', padding: '10px', fontSize: '0.9rem', borderRadius: '8px', border: '1px solid var(--border-medium)' }}
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Password</label>
                                <input
                                    type="password"
                                    required
                                    className="input-search"
                                    style={{ width: '100%', padding: '10px', fontSize: '0.9rem', borderRadius: '8px', border: '1px solid var(--border-medium)' }}
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ gridColumn: '1/-1', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', alignItems: 'end' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Phone</label>
                                <input
                                    type="tel"
                                    className="input-search"
                                    style={{ width: '100%', padding: '10px', fontSize: '0.9rem', borderRadius: '8px', border: '1px solid var(--border-medium)' }}
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Role</label>
                                <select
                                    style={{ width: '100%', padding: '10px', fontSize: '0.9rem', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-body)', color: 'var(--text-main)' }}
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="user">User / Customer</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>Create User</button>
                        </div>
                    </form>
                </div>
            )}

            {/* SEARCH */}
            <div style={{ marginBottom: '20px', position: 'relative', maxWidth: '400px' }}>
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-light)',
                        background: 'var(--bg-surface)',
                        color: 'var(--text-main)'
                    }}
                />
            </div>

            {/* TABLE */}
            {error && <div style={{ padding: '20px', color: 'red', background: '#fee', marginBottom: '20px', borderRadius: '8px' }}>Error: {error}</div>}
            <div className="card-glass" style={{ overflowX: 'auto', background: 'var(--bg-surface)', border: '1px solid var(--border-light)' }}>
                <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'var(--bg-element)', borderBottom: '1px solid var(--border-light)' }}>
                        <tr>
                            <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>User</th>
                            <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Contact</th>
                            <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Role</th>
                            <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Joined</th>
                            <th style={{ padding: '16px', textAlign: 'right', color: 'var(--text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td></tr>
                        ) : filteredUsers.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {user.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{user.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {user.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {user.email}</div>
                                        {user.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {user.phone}</div>}
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        background: user.role === 'admin' ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-element)',
                                        color: user.role === 'admin' ? 'var(--primary)' : 'var(--text-muted)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        {user.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <button
                                        onClick={() => navigate(`/admin/users/${user.id}`)}
                                        style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', marginRight: '8px' }}
                                        title="View Profile"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                                        title="Delete User"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .card-glass { padding: 15px; }
                    th, td { padding: 12px !important; }
                }
            `}</style>
        </div>
    );
};

export default AdminUsers;
