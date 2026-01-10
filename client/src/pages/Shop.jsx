import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Filter } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const { addToCart } = useCart();

    const [categories, setCategories] = useState([]);

    // Category Tree Helper
    const buildCategoryTree = (cats) => {
        const map = {};
        const roots = [];
        // Deep copy to avoid mutating state directly if we needed to, but fresh map is enough
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

    // Helper to find all descendant category names including self
    const getCategoryFamily = (catName) => {
        if (catName === 'All') return ['All'];

        // Find the category object first
        const findCat = (nodes) => {
            for (let node of nodes) {
                if (node.name === catName) return node;
                if (node.children) {
                    const found = findCat(node.children);
                    if (found) return found;
                }
            }
            return null;
        };

        const tree = buildCategoryTree(categories);
        const root = findCat(tree);
        if (!root) return [catName]; // Fallback

        // Collect all names
        const names = [];
        const collect = (node) => {
            names.push(node.name);
            if (node.children) node.children.forEach(collect);
        };
        collect(root);
        return names;
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/categories');
            setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [category, searchTerm]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Fetch ALL products first, then client side filter for hierarchy support
            // (We could optimize API to do this, but this is robust for now)
            const response = await axios.get('/api/products');
            let filtered = response.data;

            if (category !== 'All') {
                const family = getCategoryFamily(category);
                filtered = filtered.filter(p => family.includes(p.category));
            }

            if (searchTerm) {
                const lower = searchTerm.toLowerCase();
                filtered = filtered.filter(p =>
                    p.name.toLowerCase().includes(lower) ||
                    p.description?.toLowerCase().includes(lower)
                );
            }

            setProducts(filtered);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Accordion Component
    const CategoryAccordion = ({ cat, activeCategory, onSelect, level = 0 }) => {
        const [isOpen, setIsOpen] = useState(false);
        const hasChildren = cat.children && cat.children.length > 0;

        return (
            <div style={{ marginLeft: level * 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button
                        onClick={() => { onSelect(cat.name); if (window.innerWidth < 900) setSidebarOpen(false); }}
                        style={{
                            textAlign: 'left',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            background: activeCategory === cat.name ? 'var(--primary)' : 'transparent',
                            color: activeCategory === cat.name ? 'white' : 'var(--text-main)',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            flex: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {cat.name}
                    </button>
                    {hasChildren && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                        >
                            {isOpen ? '▼' : '▶'}
                        </button>
                    )}
                </div>
                {hasChildren && isOpen && (
                    <div style={{ marginTop: '2px' }}>
                        {cat.children.map(child => (
                            <CategoryAccordion
                                key={child.id}
                                cat={child}
                                activeCategory={activeCategory}
                                onSelect={onSelect}
                                level={level + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="shop-container">
            {/* Header */}
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--text-main)' }}>Shop</h1>
                <p style={{ color: 'var(--text-muted)' }}>Quality accessories for your devices.</p>
            </div>

            {/* Mobile Filter Toggle */}
            <button className="mobile-filter-toggle" onClick={() => setSidebarOpen(true)}>
                <Filter size={18} /> Filter Categories
            </button>

            <div className="shop-layout">
                {/* Sidebar */}
                <div className={`shop-sidebar ${sidebarOpen ? 'shop-sidebar-open' : ''}`}>
                    <div className="shop-sidebar-title">
                        <h3>Categories</h3>
                        <button className="shop-sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <button
                            onClick={() => { setCategory('All'); setSidebarOpen(false); }}
                            style={{
                                textAlign: 'left',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                background: category === 'All' ? 'var(--primary)' : 'transparent',
                                color: category === 'All' ? 'white' : 'var(--text-main)',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            All Products
                        </button>
                        {buildCategoryTree(categories).map(cat => (
                            <CategoryAccordion
                                key={cat.id}
                                cat={cat}
                                activeCategory={category}
                                onSelect={setCategory}
                            />
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="shop-main">
                    <div className="shop-header-controls">
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
                            {category === 'All' ? 'All Products' : category}
                        </h2>
                        {/* Search */}
                        <div className="shop-search-container">
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-search"
                                style={{ paddingLeft: '40px', fontSize: '0.95rem' }}
                            />
                        </div>
                    </div>

                    {/* Product Grid */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>Loading products...</div>
                    ) : products.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>No products found.</div>
                    ) : (
                        <div className="product-grid">
                            {products.map(product => (
                                <div key={product.id} className="product-card">
                                    <Link to={`/shop/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div className="product-image-container">
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="product-image"
                                            />
                                        </div>
                                    </Link>

                                    <div className="product-details">
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '5px' }}>
                                            {product.category}
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', color: 'var(--text-main)' }}>
                                            <Link to={`/shop/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {product.name}
                                            </Link>
                                        </h3>

                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
                                            {product.condition && (
                                                <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', background: '#e0f2fe', color: '#0369a1', fontWeight: '500' }}>
                                                    {product.condition}
                                                </span>
                                            )}
                                            {product.storage && (
                                                <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', background: '#f3f4f6', color: '#374151', fontWeight: '500' }}>
                                                    {product.storage}
                                                </span>
                                            )}
                                        </div>

                                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                                                {product.price.toFixed(0)} DKK
                                            </span>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="btn-primary btn-add-cart"
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '20px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '0.9rem',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <ShoppingBag size={16} /> Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default Shop;
