import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const AdminBrands = () => {
    const [brands, setBrands] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBrand, setCurrentBrand] = useState(null); // If null, adding new. If set, editing.
    const [formData, setFormData] = useState({ name: '', image: '' });

    const fetchBrands = () => {
        axios.get('/api/brands').then(res => setBrands(res.data));
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentBrand) {
                await axios.put(`/api/admin/brands/${currentBrand.id}`, formData);
            } else {
                await axios.post('/api/admin/brands', formData);
            }
            setIsModalOpen(false);
            setCurrentBrand(null);
            setFormData({ name: '', image: '' });
            fetchBrands();
        } catch (error) {
            alert('Error saving brand');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this brand?')) {
            await axios.delete(`/api/admin/brands/${id}`);
            fetchBrands();
        }
    };

    const openEdit = (brand) => {
        setCurrentBrand(brand);
        setFormData({ name: brand.name, image: brand.image });
        setIsModalOpen(true);
    };

    const openAdd = () => {
        setCurrentBrand(null);
        setFormData({ name: '', image: '' });
        setIsModalOpen(true);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Brands</h1>
                <button
                    onClick={openAdd}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Plus size={20} /> Add Brand
                </button>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#F9FAFB', color: '#6B7280', fontSize: '0.875rem', textTransform: 'uppercase' }}>
                        <tr>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>ID</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>Image</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>Name</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{ color: '#111827', fontSize: '0.95rem' }}>
                        {brands.map(brand => (
                            <tr key={brand.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                <td style={{ padding: '16px 24px', color: '#6B7280' }}>#{brand.id}</td>
                                <td style={{ padding: '16px 24px' }}>
                                    <img src={brand.image || 'https://placehold.co/40'} alt={brand.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'contain', background: '#f3f4f6' }} />
                                </td>
                                <td style={{ padding: '16px 24px', fontWeight: '500' }}>{brand.name}</td>
                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                        <button onClick={() => openEdit(brand)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer', color: '#4B5563' }}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(brand.id)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #FCA5A5', background: '#FEF2F2', cursor: 'pointer', color: '#EF4444' }}>
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
                            {currentBrand ? 'Edit Brand' : 'Add New Brand'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Brand Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem' }}
                                    placeholder="e.g. Apple"
                                />
                            </div>
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Image URL</label>
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
                                    {currentBrand ? 'Save Changes' : 'Create Brand'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBrands;
