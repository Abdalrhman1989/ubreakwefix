import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Check, X, Building, Mail, Phone, MapPin } from 'lucide-react';

const AdminBusinessRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axios.get('/api/admin/requests/business');
            setRequests(res.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm("Approve this business? This will generate a user account and email credentials.")) return;
        try {
            await axios.post(`/api/admin/business-requests/${id}/approve`);
            alert("Business Approved!");
            fetchRequests();
        } catch (error) {
            console.error(error);
            alert("Error approving request");
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Reject this application?")) return;
        try {
            await axios.post(`/api/admin/business-requests/${id}/reject`);
            fetchRequests();
        } catch (error) {
            console.error(error);
            alert("Error rejecting request");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '30px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Briefcase /> Business Applications
            </h1>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Company Details</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr>
                        ) : requests.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No pending requests.</td></tr>
                        ) : (
                            requests.map(req => (
                                <tr key={req.id}>
                                    <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                                        {new Date(req.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>{req.company_name}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>CVR: {req.cvr}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}><MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />{req.address}</div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {req.email}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}><Phone size={14} /> {req.phone}</div>
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            background: req.status === 'approved' ? '#dcfce7' : req.status === 'rejected' ? '#fee2e2' : '#fef9c3',
                                            color: req.status === 'approved' ? '#166534' : req.status === 'rejected' ? '#991b1b' : '#854d0e'
                                        }}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        {req.status === 'pending' && (
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() => handleApprove(req.id)}
                                                    style={{ background: '#22c55e', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                                                    title="Approve"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(req.id)}
                                                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                                                    title="Reject"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBusinessRequests;
