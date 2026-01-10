import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const AdminModels = () => {
    const [models, setModels] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentModel, setCurrentModel] = useState(null);
    const [formData, setFormData] = useState({ brand_id: '', name: '', family: '', image: '' });

    const fetchModels = () => {
        axios.get('/api/models').then(res => setModels(res.data));
    };

    const fetchBrands = () => {
        axios.get('/api/brands').then(res => setBrands(res.data));
    };

    useEffect(() => {
        fetchModels();
        fetchBrands();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentModel) {
                await axios.put(`/api/admin/models/${currentModel.id}`, formData);
            } else {
                await axios.post('/api/admin/models', formData);
            }
            setIsModalOpen(false);
            setCurrentModel(null);
            setFormData({ brand_id: '', name: '', family: '', image: '' });
            fetchModels();
        } catch (error) {
            alert('Error saving model');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this model?')) {
            await axios.delete(`/api/admin/models/${id}`);
            fetchModels();
        }
    };

    const openEdit = (model) => {
        setCurrentModel(model);
        setFormData({ brand_id: model.brand_id, name: model.name, family: model.family || '', image: model.image });
        setIsModalOpen(true);
    };

    const openAdd = () => {
        setCurrentModel(null);
        setFormData({ brand_id: brands[0]?.id || '', name: '', family: '', image: '' });
        setIsModalOpen(true);
    };

    // Hardcoded Families Structure (Matches seed.js)
    const BRAND_FAMILIES = {
        'Apple': ['iPhone', 'iPhone SE', 'iPad', 'iPad mini', 'iPad Air', 'iPad Pro', 'MacBook Air', 'MacBook Pro', 'Desktop', 'Apple Watch Series', 'Apple Watch SE', 'Apple Watch Ultra', 'AirPods', 'AirPods Pro', 'AirPods Max'],
        'Samsung': ['Galaxy S', 'Galaxy Z', 'Galaxy A', 'Galaxy Note', 'Galaxy Tab', 'Galaxy Book', 'Galaxy Watch', 'Galaxy Buds'],
        'Google': ['Pixel', 'Pixel Fold', 'Pixel Tablet', 'Pixel Watch', 'Pixel Buds'],
        'OnePlus': ['OnePlus Phones', 'OnePlus Nord', 'OnePlus Pad', 'OnePlus Watch', 'OnePlus Buds'],
        'Huawei': ['P Series', 'Mate Series', 'Nova Series', 'Y Series', 'Tablets', 'Laptops', 'Watch', 'Audio'],
        'Oppo': ['Find Series', 'Reno Series', 'A Series', 'Tablet', 'Watch', 'Audio'],
        'Xiaomi': ['Xiaomi Series', 'Redmi Note', 'Redmi', 'POCO', 'Tablet', 'Laptop', 'Watch', 'Audio'],
        'LG': ['Velvet', 'V Series', 'G Series', 'K Series', 'Tablet', 'Laptop', 'Audio'],
        'Nokia': ['X Series', 'G Series', 'C Series', 'Tablet', 'Audio'],
        'Sony': ['Xperia', 'Tablet', 'Audio', 'PlayStation'],
        'Microsoft': ['Xbox'],
        'Nintendo': ['Switch']
    };

    const getFamiliesForBrand = (brandId) => {
        const brand = brands.find(b => b.id == brandId);
        if (!brand) return [];
        return BRAND_FAMILIES[brand.name] || [];
    };

    const handleBrandChange = (e) => {
        const newBrandId = e.target.value;
        setFormData({ ...formData, brand_id: newBrandId, family: '' }); // Reset family on brand change
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Models</h1>
                <button
                    onClick={openAdd}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Plus size={20} /> Add Model
                </button>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#F9FAFB', color: '#6B7280', fontSize: '0.875rem', textTransform: 'uppercase' }}>
                        <tr>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>ID</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>Brand</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>Name</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{ color: '#111827', fontSize: '0.95rem' }}>
                        {models.map(model => (
                            <tr key={model.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                <td style={{ padding: '16px 24px', color: '#6B7280' }}>#{model.id}</td>
                                <td style={{ padding: '16px 24px' }}>
                                    <span style={{ background: '#EFF6FF', color: '#2563EB', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
                                        {model.brand_name}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 24px', fontWeight: '500' }}>
                                    {model.name}
                                    {model.family && <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{model.family}</div>}
                                </td>
                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                        <button onClick={() => openEdit(model)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer', color: '#4B5563' }}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(model.id)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #FCA5A5', background: '#FEF2F2', cursor: 'pointer', color: '#EF4444' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
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
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>
                            {currentModel ? 'Edit Model' : 'Add New Model'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Brand</label>
                                <select
                                    required
                                    value={formData.brand_id}
                                    onChange={handleBrandChange}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem', background: 'white' }}
                                >
                                    <option value="">Select Brand</option>
                                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Model Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem' }}
                                    placeholder="e.g. iPhone 15 Pro"
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Family / Series (Optional)</label>
                                <select
                                    value={formData.family}
                                    onChange={(e) => setFormData({ ...formData, family: e.target.value })}
                                    disabled={!formData.brand_id}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem', background: (!formData.brand_id) ? '#F3F4F6' : 'white' }}
                                >
                                    <option value="">Select Series</option>
                                    {getFamiliesForBrand(formData.brand_id).map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Image URL (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem' }}
                                    placeholder="https://..."
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline" style={{ borderRadius: '8px' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ borderRadius: '8px' }}>
                                    {currentModel ? 'Save Changes' : 'Create Model'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminModels;
