import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit2, Save, X, Search } from 'lucide-react';

const AdminScreenRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axios.get('/api/admin/requests/sell-screen');
            setRequests(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/admin/requests/sell-screen/${editingItem.id}`, {
                status: editingItem.status,
                admin_offer: editingItem.admin_offer,
                admin_notes: editingItem.admin_notes
            });
            setEditingItem(null);
            fetchRequests();
        } catch (err) {
            alert('Failed to update request');
        }
    };

    const filteredRequests = requests.filter(r =>
        r.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Sell Screen Requests</h1>

                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Search requests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid var(--border-light)', minWidth: '300px' }}
                    />
                    <Search size={20} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
            </div>

            <div className="card-glass" style={{ padding: '20px', borderRadius: '16px' }}>
                <div className="table-container">
                    <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
                                <th style={{ padding: '15px' }}>Date</th>
                                <th style={{ padding: '15px' }}>Customer</th>
                                <th style={{ padding: '15px' }}>Description</th>
                                <th style={{ padding: '15px' }}>Qty</th>
                                <th style={{ padding: '15px' }}>Admin Offer</th>
                                <th style={{ padding: '15px' }}>Status</th>
                                <th style={{ padding: '15px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map(req => (
                                <tr key={req.id} style={{ borderBottom: '1px solid var(--bg-body)' }}>
                                    <td style={{ padding: '15px' }}>{new Date(req.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '15px' }}>
                                        <div>{req.customer_name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.customer_email}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.customer_phone}</div>
                                    </td>
                                    <td style={{ padding: '15px', maxWidth: '300px' }}>{req.description}</td>
                                    <td style={{ padding: '15px' }}>{req.quantity}</td>
                                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#10B981' }}>
                                        {req.admin_offer ? `${req.admin_offer} DKK` : '-'}
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <span className={`status-badge ${req.status?.toLowerCase() || 'pending'}`} style={{
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem',
                                            background: req.status === 'Completed' ? '#D1FAE5' : req.status === 'Rejected' ? '#FEE2E2' : '#E0E7FF',
                                            color: req.status === 'Completed' ? '#065F46' : req.status === 'Rejected' ? '#991B1B' : '#3730A3'
                                        }}>
                                            {req.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <button onClick={() => setEditingItem(req)} aria-label="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
                                            <Edit2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* EDIT MODAL */}
            {editingItem && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '500px', maxWidth: '90%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Update Request #{editingItem.id}</h2>
                            <button onClick={() => setEditingItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                        </div>

                        <form onSubmit={handleUpdate}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Status</label>
                                <select
                                    value={editingItem.status || 'Pending'}
                                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Inspection">Inspection</option>
                                    <option value="Completed">Completed (Offer Accepted)</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Admin Offer (DKK)</label>
                                <input
                                    type="number"
                                    value={editingItem.admin_offer || ''}
                                    placeholder="Enter Offer Amount"
                                    onChange={(e) => setEditingItem({ ...editingItem, admin_offer: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Admin Notes</label>
                                <textarea
                                    value={editingItem.admin_notes || ''}
                                    onChange={(e) => setEditingItem({ ...editingItem, admin_notes: e.target.value })}
                                    rows={4}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setEditingItem(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'white' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminScreenRequests;
