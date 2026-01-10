import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, ChevronRight } from 'lucide-react';

const AdminRepairs = () => {
    const [repairs, setRepairs] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);

    // Selection State
    const [selectedBrandId, setSelectedBrandId] = useState('');
    const [selectedFamily, setSelectedFamily] = useState('');
    const [selectedModelId, setSelectedModelId] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRepair, setCurrentRepair] = useState(null);
    const [formData, setFormData] = useState({ model_id: '', name: '', price: '', duration: '', description: '' });

    // 1. Fetch Brands on Load
    useEffect(() => {
        axios.get('/api/brands').then(res => {
            setBrands(res.data);
            // Optional: Default to first brand (usually Apple)
            if (res.data.length > 0) setSelectedBrandId(res.data[0].id);
        });
    }, []);

    // 2. Fetch Models when Brand changes (and reset everything else)
    useEffect(() => {
        if (selectedBrandId) {
            axios.get(`/api/brands/${selectedBrandId}/models`).then(res => {
                setModels(res.data);
                setSelectedFamily(''); // Reset family
                setSelectedModelId(''); // Reset model
            });
        }
    }, [selectedBrandId]);

    // Helper: Get Unique Families from the fetched models
    const getFamilies = () => {
        const families = [...new Set(models.map(m => m.family || 'Other'))];
        return families.sort();
    };

    // Helper: Filter Models by selected family
    const filteredModels = models.filter(m => !selectedFamily || (m.family || 'Other') === selectedFamily);

    // 3. Fetch Repairs when Model changes
    useEffect(() => {
        if (selectedModelId) {
            axios.get(`/api/models/${selectedModelId}/repairs`).then(res => setRepairs(res.data));
        } else {
            setRepairs([]);
        }
    }, [selectedModelId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { ...formData, model_id: selectedModelId };
            if (currentRepair) {
                await axios.put(`/api/admin/repairs/${currentRepair.id}`, data);
            } else {
                await axios.post('/api/admin/repairs', data);
            }
            setIsModalOpen(false);
            setCurrentRepair(null);
            setFormData({ model_id: selectedModelId, name: '', price: '', duration: '', description: '' });
            if (selectedModelId) axios.get(`/api/models/${selectedModelId}/repairs`).then(res => setRepairs(res.data));
        } catch (error) {
            alert('Error saving repair');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this repair?')) {
            await axios.delete(`/api/admin/repairs/${id}`);
            if (selectedModelId) axios.get(`/api/models/${selectedModelId}/repairs`).then(res => setRepairs(res.data));
        }
    };

    const openEdit = (repair) => {
        setCurrentRepair(repair);
        setFormData({
            model_id: repair.model_id,
            name: repair.name,
            price: repair.price,
            duration: repair.duration,
            description: repair.description
        });
        setIsModalOpen(true);
    };

    const openAdd = () => {
        setCurrentRepair(null);
        setFormData({ model_id: selectedModelId, name: '', price: '', duration: '60 min', description: '' });
        setIsModalOpen(true);
    };

    // Get current model name for display
    const currentModelName = models.find(m => m.id == selectedModelId)?.name || "Device";

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Repairs & Prices</h1>
                <p style={{ color: '#6B7280', marginTop: '5px' }}>
                    Select a **Brand**, **Series**, and **Model** to manage its price list.
                </p>

                {/* FILTERS */}
                <div style={{ display: 'flex', gap: '15px', marginTop: '20px', alignItems: 'center', flexWrap: 'wrap' }}>

                    {/* Brand Selector */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', color: '#4B5563' }}>Step 1: Brand</label>
                        <select
                            value={selectedBrandId}
                            onChange={(e) => setSelectedBrandId(e.target.value)}
                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', minWidth: '150px' }}
                        >
                            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                    </div>

                    <ChevronRight size={20} style={{ color: '#9CA3AF', marginTop: '20px' }} />

                    {/* Family Selector */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', color: '#4B5563' }}>Step 2: Series</label>
                        <select
                            value={selectedFamily}
                            onChange={(e) => { setSelectedFamily(e.target.value); setSelectedModelId(''); }}
                            disabled={!selectedBrandId}
                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', minWidth: '150px' }}
                        >
                            <option value="">All Series</option>
                            {getFamilies().map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>

                    <ChevronRight size={20} style={{ color: '#9CA3AF', marginTop: '20px' }} />

                    {/* Model Selector */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', color: '#4B5563' }}>Step 3: Model</label>
                        <select
                            value={selectedModelId}
                            onChange={(e) => setSelectedModelId(e.target.value)}
                            disabled={!selectedBrandId || models.length === 0}
                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', minWidth: '200px' }}
                        >
                            {!selectedFamily && <option value="">Select a Model...</option>}
                            {filteredModels.length === 0 && <option>No models found</option>}
                            {filteredModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={openAdd}
                        disabled={!selectedModelId}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', marginLeft: 'auto', opacity: !selectedModelId ? 0.5 : 1 }}
                    >
                        <Plus size={20} /> Add Repair
                    </button>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#F9FAFB', color: '#6B7280', fontSize: '0.875rem', textTransform: 'uppercase' }}>
                        <tr>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>Name</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>Price</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>Duration</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{ color: '#111827', fontSize: '0.95rem' }}>
                        {repairs.length > 0 ? repairs.map(repair => (
                            <tr key={repair.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                <td style={{ padding: '16px 24px', fontWeight: '500' }}>{repair.name}</td>
                                <td style={{ padding: '16px 24px' }}>kr {repair.price}</td>
                                <td style={{ padding: '16px 24px' }}>{repair.duration}</td>
                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                        <button onClick={() => openEdit(repair)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer', color: '#4B5563' }}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(repair.id)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #FCA5A5', background: '#FEF2F2', cursor: 'pointer', color: '#EF4444' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#9CA3AF' }}>
                                    {!selectedModelId ? "Please select a model above." : "No repairs found for this model."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '500px', position: 'relative' }}>
                        <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                            <X size={24} />
                        </button>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
                            {currentRepair ? 'Edit Repair' : 'Add New Repair'}
                        </h2>
                        <div style={{ color: '#2563EB', fontWeight: 'bold', marginBottom: '20px', background: '#EFF6FF', padding: '10px', borderRadius: '8px' }}>
                            Adding for: {currentModelName}
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Repair Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem' }}
                                    placeholder="e.g. Screen Replacement"
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Price (kr)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Duration</label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem' }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem', height: '80px', fontFamily: 'inherit' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline" style={{ borderRadius: '8px' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ borderRadius: '8px' }}>
                                    {currentRepair ? 'Save Changes' : 'Create Repair'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRepairs;
