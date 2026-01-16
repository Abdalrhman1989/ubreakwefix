import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Save } from 'lucide-react';

const AdminConditions = () => {
    const [conditions, setConditions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConditions();
    }, []);

    const fetchConditions = () => {
        axios.get('/api/conditions')
            .then(res => {
                setConditions(res.data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    const handleUpdate = async (id, field, value) => {
        const updated = conditions.map(c => c.id === id ? { ...c, [field]: value } : c);
        setConditions(updated);
    };

    const saveCondition = async (condition) => {
        try {
            await axios.put(`/api/admin/conditions/${condition.id}`, {
                multiplier: condition.multiplier,
                description: condition.description
            });
            alert('Condition updated!');
        } catch (err) {
            alert('Error updating condition');
        }
    };

    if (loading) return <div style={{ padding: '40px' }}>Loading...</div>;

    return (
        <div style={{ padding: '40px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '30px' }}>Global Condition Settings</h1>
            <p style={{ marginBottom: '30px', color: '#6B7280' }}>
                These multipliers affect the estimated buyback price for ALL devices.
                <br />
                <strong>Formula:</strong> (Base Price + Storage Adjustment) × Multiplier
            </p>

            <div style={{ display: 'grid', gap: '20px' }}>
                {conditions.map(c => (
                    <div key={c.id} style={{
                        background: 'white', padding: '20px', borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'flex', alignItems: 'center', gap: '20px'
                    }}>
                        <div style={{ width: '200px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{c.label}</div>
                            <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>ID: {c.id}</div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#6B7280', marginBottom: '4px' }}>Description</label>
                            <input
                                type="text"
                                value={c.description}
                                onChange={(e) => handleUpdate(c.id, 'description', e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                            />
                        </div>

                        <div style={{ width: '150px' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#6B7280', marginBottom: '4px' }}>Multiplier (0.1 - 1.0)</label>
                            <input
                                type="number"
                                step="0.05"
                                min="0"
                                max="1"
                                value={c.multiplier}
                                onChange={(e) => handleUpdate(c.id, 'multiplier', parseFloat(e.target.value))}
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                            />
                        </div>

                        <button
                            onClick={() => saveCondition(c)}
                            style={{
                                padding: '10px 15px', background: '#2563EB', color: 'white', border: 'none',
                                borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            <Save size={18} /> Save
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminConditions;
