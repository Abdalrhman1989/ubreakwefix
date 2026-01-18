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
        category_id: '', // Important for filtering
        category: '', // Legacy/Visual
        image_url: '',
        stock_quantity: 0,
        specs: { // New specs object
            brand: '',
            model: '',
            features: []
        },
        // Legacy flat fields kept for UI simplicity if needed, but we should map them to specs on submit
        condition: '',
        storage: '',
        color: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let active = true;
        fetchCategories();

        const fetchData = async () => {
            if (isEditMode) {
                setLoading(true); // Block UI
                try {
                    const res = await axios.get(`/api/products/${id}`);
                    if (active) {
                        const prod = res.data;
                        setFormData({
                            ...prod,
                            condition: prod.specs?.condition || prod.condition || '',
                            storage: prod.specs?.storage || prod.storage || '',
                            color: prod.specs?.color || prod.color || '',
                            specs: prod.specs || { brand: '', model: '', features: [] }
                        });
                    }
                } catch (error) {
                    if (active) {
                        console.error("Error fetching product:", error);
                        alert("Failed to load product data");
                    }
                } finally {
                    if (active) setLoading(false);
                }
            }
        };

        fetchData();

        return () => { active = false; };
    }, [id]);

    if (loading && isEditMode) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/categories');
            setCategories(res.data);
            if (!isEditMode && res.data.length > 0) {
                // No auto-select
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('spec.')) {
            const specKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                specs: { ...prev.specs, [specKey]: value }
            }));
        } else if (name === 'category_id') {
            const cat = categories.find(c => c.id == value);
            setFormData(prev => ({
                ...prev,
                category_id: value,
                category: cat ? cat.name : ''
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        console.log("DEBUG: handleSubmit CALLED", isEditMode);
        e.preventDefault();
        setLoading(true);

        // Prepare payload - merge flat fields into specs for consistency
        const payload = {
            ...formData,
            specs: {
                ...formData.specs,
                condition: formData.condition,
                storage: formData.storage,
                color: formData.color,
                // Ensure array if features is string? (Simplification: keeping it simple)
            }
        };

        try {
            if (isEditMode) {
                console.log("DEBUG: Sending PUT payload", payload);
                const res = await axios.put(`/api/admin/products/${id}`, payload);
                console.log("DEBUG: PUT Response", res.data);
            } else {
                await axios.post('/api/admin/products', payload);
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
        <div className="admin-form-container">
            <button
                onClick={() => navigate('/admin/products')}
                className="btn-back"
            >
                <ArrowLeft size={18} /> Back to Products
            </button>

            <h1 style={{ marginBottom: '30px', color: 'var(--text-main)' }}>
                {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>

            <form onSubmit={handleSubmit} className="admin-form" noValidate>
                <div className="form-group">
                    <label>Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Price (DKK)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {formattedCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.displayName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Specs Section */}
                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', marginTop: '10px' }}>Specifications</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label>Brand</label>
                        <input
                            type="text"
                            name="spec.brand"
                            value={formData.specs?.brand || ''}
                            onChange={handleChange}
                            placeholder="e.g. Apple"
                        />
                    </div>
                    <div className="form-group">
                        <label>Model</label>
                        <input
                            type="text"
                            name="spec.model"
                            value={formData.specs?.model || ''}
                            onChange={handleChange}
                            placeholder="e.g. iPhone 15"
                        />
                    </div>
                </div>

                <div className="form-row three-col">
                    <div className="form-group">
                        <label>Condition</label>
                        <input
                            type="text"
                            name="condition"
                            value={formData.condition || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Storage</label>
                        <input
                            type="text"
                            name="storage"
                            value={formData.storage || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Color</label>
                        <input
                            type="text"
                            name="color"
                            value={formData.color || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Image URL</label>
                    <input
                        type="text"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                    />
                    {formData.image_url && (
                        <div style={{ marginTop: '10px', background: '#f5f5f7', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                            <img src={formData.image_url} alt="Preview" style={{ height: '150px', objectFit: 'contain' }} />
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Stock Quantity</label>
                    <input
                        type="number"
                        name="stock_quantity"
                        value={formData.stock_quantity}
                        onChange={handleChange}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    data-testid="admin-save-product-btn"
                    className="btn-primary"
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                    <Save size={20} /> {loading ? 'Saving...' : 'Save Product'}
                </button>
            </form>

            <style>{`
                .admin-form-container { padding: 20px; max-width: 800px; margin: 0 auto; }
                .btn-back { display: flex; align-items: center; gap: 5px; background: none; border: none; color: var(--text-muted); cursor: pointer; margin-bottom: 20px; }
                .admin-form { background: var(--bg-surface); padding: 30px; borderRadius: 12px; border: 1px solid var(--border-light); }
                
                .form-group { margin-bottom: 20px; }
                .form-group label { display: block; margin-bottom: 8px; color: var(--text-main); font-weight: 500; }
                .form-group input, .form-group textarea, .form-group select { 
                    width: 100%; padding: 12px; border-radius: 8px; 
                    border: 1px solid var(--border-medium); 
                    background: var(--bg-element); color: var(--text-main); font-size: 0.95rem;
                }
                
                .form-row { display: grid; gap: 20px; grid-template-columns: 1fr; margin-bottom: 20px; }
                
                @media (min-width: 600px) {
                    .form-row { grid-template-columns: 1fr 1fr; }
                    .form-row.three-col { grid-template-columns: 1fr 1fr 1fr; }
                }

                @media (max-width: 600px) {
                    .admin-form { padding: 20px; }
                    .form-row.three-col { grid-template-columns: 1fr; } 
                }
            `}</style>
        </div>
    );
};

export default AdminProductForm;
