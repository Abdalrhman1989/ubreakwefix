import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layers, Plus, Edit, Trash2, X, Save } from 'lucide-react';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_url: '',
        parent_id: ''
    });

    // Helper to organize categories into a tree
    const buildCategoryTree = (cats) => {
        const map = {};
        const roots = [];
        cats.forEach(cat => {
            map[cat.id] = { ...cat, children: [] };
        });
        cats.forEach(cat => {
            if (cat.parent_id && map[cat.parent_id]) {
                map[cat.parent_id].children.push(map[cat.id]);
            } else {
                roots.push(map[cat.id]);
            }
        });
        return roots;
    };

    const CategoryRow = ({ cat, level = 0 }) => (
        <>
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '15px', fontWeight: level === 0 ? '600' : '400', paddingLeft: `${15 + level * 30}px`, color: level === 0 ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {level > 0 && '└─ '}{cat.name}
                </td>
                <td style={{ padding: '15px', color: 'var(--text-muted)' }}>{cat.description || '-'}</td>
                <td style={{ padding: '15px' }}>-</td>
                <td style={{ padding: '15px', textAlign: 'right' }}>
                    <button
                        onClick={() => handleOpenModal(cat)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', marginRight: '10px' }}
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(cat.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                    >
                        <Trash2 size={18} />
                    </button>
                </td>
            </tr>
            {cat.children && cat.children.map(child => <CategoryRow key={child.id} cat={child} level={level + 1} />)}
        </>
    );

    const sortedCategories = buildCategoryTree(categories);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/categories');
            setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await axios.put(`/api/admin/categories/${editingCategory.id}`, formData);
            } else {
                await axios.post('/api/admin/categories', formData);
            }
            fetchCategories();
            handleCloseModal();
        } catch (error) {
            console.error("Error saving category:", error);
            alert("Failed to save category");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure? This might affect products using this category.')) {
            try {
                await axios.delete(`/api/admin/categories/${id}`);
                fetchCategories();
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description || '',
                image_url: category.image_url || '',
                parent_id: category.parent_id || ''
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '', image_url: '', parent_id: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Layers /> Categories
                </h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                >
                    <Plus size={20} /> Add Category
                </button>
            </div>

            <div className="table-container" style={{ overflowX: 'auto', background: 'var(--bg-surface)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>Name</th>
                            <th style={{ padding: '15px' }}>Description</th>
                            <th style={{ padding: '15px' }}>Count (est.)</th>
                            <th style={{ padding: '15px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr>
                        ) : categories.length === 0 ? (
                            <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>No categories found.</td></tr>
                        ) : (
                            sortedCategories.map(cat => (
                                <CategoryRow key={cat.id} cat={cat} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}>
                    <div style={{
                        background: 'var(--bg-surface)',
                        width: '100%', maxWidth: '500px',
                        borderRadius: '16px',
                        padding: '30px',
                        position: 'relative',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                    }}>
                        <button
                            onClick={handleCloseModal}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                            <X size={24} />
                        </button>

                        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--text-main)' }}>
                            {editingCategory ? 'Edit Category' : 'New Category'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-element)', color: 'var(--text-main)' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Description (Optional)</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-element)', color: 'var(--text-main)' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '500' }}>Parent Category</label>
                                <select
                                    value={formData.parent_id}
                                    onChange={e => setFormData({ ...formData, parent_id: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-element)', color: 'var(--text-main)' }}
                                >
                                    <option value="">None (Top Level)</option>
                                    {categories.map(cat => (
                                        // Simple flat list for selection, maybe filter out self/children to avoid cycles if ambitious
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <Save size={20} /> Save Category
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
