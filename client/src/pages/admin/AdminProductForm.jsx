import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

const AdminProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '', // Will default after fetch
        image_url: '',
        condition: '', // Like New, Good, Fair
        storage: '', // 64GB, 128GB...
        color: '', // Space Gray, Silver...
        stock_quantity: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/categories');
            setCategories(res.data);
            setCategories(res.data);

            // Auto-select
            if (!isEditMode && res.data.length > 0) {
                // Try to find a leaf node or just first one
                setFormData(prev => ({ ...prev, category: res.data[0].name }));
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Helper to format category name with hierarchy
    const getFormattedCategories = () => {
        const map = {};
        categories.forEach(c => map[c.id] = c);

        return categories.map(c => {
            let name = c.name;
            let current = c;
            while (current.parent_id && map[current.parent_id]) {
                current = map[current.parent_id];
                name = current.name + ' > ' + name;
            }
            return { ...c, displayName: name };
        }).sort((a, b) => a.displayName.localeCompare(b.displayName));
    };

    const formattedCategories = getFormattedCategories();

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`/api/products/${id}`);
            setFormData(res.data);
        } catch (error) {
            console.error("Error fetching product:", error);
            alert("Failed to load product data");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditMode) {
                await axios.put(`/api/admin/products/${id}`, formData);
            } else {
                await axios.post('/api/admin/products', formData);
            }
            navigate('/admin/products');
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <button
                onClick={() => navigate('/admin/products')}
                style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '20px'
                }}
            >
                <ArrowLeft size={18} /> Back to Products
            </button>

            <h1 style={{ marginBottom: '30px', color: 'var(--text-main)' }}>
                {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>

            <form onSubmit={handleSubmit} style={{ background: 'var(--bg-surface)', padding: '30px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-element)', color: 'var(--text-main)' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-element)', color: 'var(--text-main)' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Price (DKK)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-element)', color: 'var(--text-main)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-element)', color: 'var(--text-main)' }}
                        >
                            {formattedCategories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.displayName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Used Phone Specifics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Condition (e.g. Good)</label>
                        <input
                            type="text"
                            name="condition"
                            value={formData.condition || ''}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-element)', color: 'var(--text-main)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Storage (e.g. 128GB)</label>
                        <input
                            type="text"
                            name="storage"
                            value={formData.storage || ''}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-element)', color: 'var(--text-main)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Color</label>
                        <input
                            type="text"
                            name="color"
                            value={formData.color || ''}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-element)', color: 'var(--text-main)' }}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Image URL</label>
                    <input
                        type="text"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-element)', color: 'var(--text-main)' }}
                    />
                    {formData.image_url && (
                        <div style={{ marginTop: '10px' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Preview:</p>
                            <img src={formData.image_url} alt="Preview" style={{ height: '100px', objectFit: 'contain', background: '#f5f5f7', padding: '5px', borderRadius: '4px' }} />
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Stock Quantity</label>
                    <input
                        type="number"
                        name="stock_quantity"
                        value={formData.stock_quantity}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-element)', color: 'var(--text-main)' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                    <Save size={20} /> {loading ? 'Saving...' : 'Save Product'}
                </button>
            </form>
        </div>
    );
};

export default AdminProductForm;
