import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Filter, ChevronDown, ChevronRight, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Shop = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]); // Displayed products
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    // Filter State
    const [filters, setFilters] = useState({
        categoryId: null, // Selected Category ID
        searchTerm: '',
        brands: [],
        features: []
    });

    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Initial Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    axios.get('/api/categories'),
                    axios.get('/api/products') // Fetches ALL products
                ]);
                setCategories(catRes.data);
                setAllProducts(prodRes.data);
                setProducts(prodRes.data);
            } catch (error) {
                console.error("Error loading shop data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper: Get Descendant Category IDs
    const getDescendantIds = (catId) => {
        let ids = [catId];
        const children = categories.filter(c => c.parent_id === catId);
        children.forEach(child => {
            ids = [...ids, ...getDescendantIds(child.id)];
        });
        return ids;
    };

    // Filter Logic
    useEffect(() => {
        let result = [...allProducts];

        // 1. Category Filter (Recursive)
        if (filters.categoryId) {
            const familyIds = getDescendantIds(filters.categoryId);
            result = result.filter(p => familyIds.includes(p.category_id));
        }

        // 2. Search Term
        if (filters.searchTerm) {
            const lower = filters.searchTerm.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(lower) ||
                p.description?.toLowerCase().includes(lower)
            );
        }

        // 3. Brands
        if (filters.brands.length > 0) {
            result = result.filter(p => filters.brands.includes(p.specs?.brand));
        }

        // 4. Features
        if (filters.features.length > 0) {
            result = result.filter(p =>
                p.specs?.features?.some(f => filters.features.includes(f))
            );
        }

        setProducts(result);
    }, [filters, allProducts, categories]);

    // Computed Options for Facets (Dynamic based on current filtered set? Or global set? 
    // Usually facets show count based on current set. Let's compute from current `result` if we want dynamic counts, 
    // or from `allProducts` filtered by CATEGORY only if we want broader options. 
    // Let's use `allProducts` filtered by Category to show available options.)

    const availableOptions = useMemo(() => {
        let currentSet = allProducts;
        if (filters.categoryId) {
            const familyIds = getDescendantIds(filters.categoryId);
            currentSet = currentSet.filter(p => familyIds.includes(p.category_id));
        }

        const brands = [...new Set(currentSet.map(p => p.specs?.brand).filter(Boolean))].sort();

        const features = [...new Set(
            currentSet.flatMap(p => p.specs?.features || [])
        )].sort();

        return { brands, features };
    }, [allProducts, filters.categoryId]);


    // Handlers
    const toggleBrand = (brand) => {
        setFilters(prev => ({
            ...prev,
            brands: prev.brands.includes(brand)
                ? prev.brands.filter(b => b !== brand)
                : [...prev.brands, brand]
        }));
    };

    const toggleFeature = (feature) => {
        setFilters(prev => ({
            ...prev,
            features: prev.features.includes(feature)
                ? prev.features.filter(f => f !== feature)
                : [...prev.features, feature]
        }));
    };

    const clearFilters = () => {
        setFilters(prev => ({ ...prev, brands: [], features: [] }));
    };

    // --- COMPONENT: Category Tree Item ---
    const CategoryItem = ({ cat }) => {
        const children = categories.filter(c => c.parent_id === cat.id);
        const isOpen = filters.categoryId === cat.id || getDescendantIds(cat.id).includes(filters.categoryId);
        const isSelected = filters.categoryId === cat.id;

        const [expanded, setExpanded] = useState(isOpen);

        return (
            <div className="category-item" style={{ marginLeft: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
                    <button
                        onClick={() => setFilters(prev => ({ ...prev, categoryId: cat.id }))}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                            fontWeight: isSelected ? 'bold' : 'normal',
                            textAlign: 'left', flex: 1
                        }}
                    >
                        {cat.name}
                    </button>
                    {children.length > 0 && (
                        <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px' }}>
                            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                    )}
                </div>
                {children.length > 0 && expanded && (
                    <div style={{ borderLeft: '1px solid var(--border)', marginLeft: '6px' }}>
                        {children.map(child => <CategoryItem key={child.id} cat={child} />)}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="shop-container">
            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '5px' }}>Shop</h1>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {filters.categoryId && (
                        <span className="badge-filter">
                            Category: {categories.find(c => c.id === filters.categoryId)?.name}
                            <X size={12} style={{ cursor: 'pointer', marginLeft: 4 }} onClick={() => setFilters(prev => ({ ...prev, categoryId: null }))} />
                        </span>
                    )}
                </div>
            </div>

            <button className="mobile-filter-toggle" onClick={() => setSidebarOpen(true)}>
                <Filter size={18} /> Filters
            </button>

            <div className="shop-layout">
                {/* SIDEBAR */}
                <div className={`shop-sidebar ${sidebarOpen ? 'shop-sidebar-open' : ''}`}>
                    <div className="shop-sidebar-header">
                        <h3>Filters</h3>
                        <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none' }}><X size={20} /></button>
                    </div>

                    <div className="filter-section">
                        <h4>Categories</h4>
                        <div className="category-tree">
                            <button
                                onClick={() => setFilters(prev => ({ ...prev, categoryId: null }))}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: !filters.categoryId ? 'var(--primary)' : 'var(--text-main)',
                                    fontWeight: !filters.categoryId ? 'bold' : 'normal',
                                    marginBottom: '8px', display: 'block', width: '100%', textAlign: 'left'
                                }}
                            >
                                All Products
                            </button>
                            {categories.filter(c => !c.parent_id).map(cat => (
                                <CategoryItem key={cat.id} cat={cat} />
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <h4>Brands</h4>
                        {availableOptions.brands.length === 0 ? <p className="text-muted text-sm">No brands available</p> : (
                            <div className="checkbox-list">
                                {availableOptions.brands.map(brand => (
                                    <label key={brand} className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={filters.brands.includes(brand)}
                                            onChange={() => toggleBrand(brand)}
                                        />
                                        <span>{brand}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="filter-section">
                        <h4>Features</h4>
                        {availableOptions.features.length === 0 ? <p className="text-muted text-sm">No features available</p> : (
                            <div className="checkbox-list">
                                {availableOptions.features.map(feature => (
                                    <label key={feature} className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={filters.features.includes(feature)}
                                            onChange={() => toggleFeature(feature)}
                                        />
                                        <span>{feature}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {(filters.brands.length > 0 || filters.features.length > 0) && (
                        <button onClick={clearFilters} className="btn-secondary" style={{ width: '100%', marginTop: '10px', padding: '8px' }}>
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* MAIN GRID */}
                <div className="shop-main">
                    <div className="shop-search-bar" style={{ position: 'relative', marginBottom: '20px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={filters.searchTerm}
                            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                            className="input-search"
                            style={{ paddingLeft: '40px', width: '100%' }}
                        />
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
                    ) : products.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No products match your filters.</div>
                    ) : (
                        <div className="product-grid">
                            {products.map(product => (
                                <div key={product.id} className="product-card">
                                    <Link to={`/shop/product/${product.id}`} className="product-link">
                                        <div className="product-image-container">
                                            <img src={product.image_url} alt={product.name} className="product-image" />
                                        </div>
                                    </Link>
                                    <div className="product-details">
                                        <div className="product-category">
                                            {categories.find(c => c.id === product.category_id)?.name || 'Accessory'}
                                        </div>
                                        <h3>
                                            <Link to={`/shop/product/${product.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                {product.name}
                                            </Link>
                                        </h3>
                                        <div className="product-specs">
                                            {product.specs?.brand && <span className="spec-badge">{product.specs.brand}</span>}
                                            {product.specs?.type && <span className="spec-badge">{product.specs.type}</span>}
                                        </div>
                                        <div className="product-footer">
                                            <span className="product-price">{product.price} DKK</span>
                                            <button onClick={() => addToCart(product)} className="btn-add">
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

            <style>{`
                .shop-container { padding: 80px 20px 40px; max-width: 1200px; margin: 0 auto; color: var(--text-main); }
                .shop-layout { display: flex; gap: 30px; position: relative; }
                .shop-sidebar { width: 250px; flex-shrink: 0; }
                .shop-main { flex: 1; }
                
                .filter-section { margin-bottom: 25px; border-bottom: 1px solid var(--border); padding-bottom: 15px; }
                .filter-section h4 { font-size: 0.95rem; margin-bottom: 12px; font-weight: 600; text-transform: uppercase; color: var(--text-muted); }
                
                .checkbox-list { display: flex; flex-direction: column; gap: 8px; max-height: 200px; overflow-y: auto; }
                .checkbox-item { display: flex; alignItems: center; gap: 8px; cursor: pointer; font-size: 0.9rem; }
                .checkbox-item input { accent-color: var(--primary); }

                .category-tree button { padding: 4px 8px; border-radius: 4px; transition: background 0.2s; }
                .category-tree button:hover { background: var(--bg-card); }

                .badge-filter { background: var(--primary); color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; display: inline-flex; alignItems: center; }

                .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
                .product-card { background: var(--bg-card); border-radius: 12px; overflow: hidden; border: 1px solid var(--border); display: flex; flex-direction: column; transition: transform 0.2s; }
                .product-card:hover { transform: translateY(-4px); }
                
                .product-image-container { aspect-ratio: 1; overflow: hidden; background: #f0f0f0; }
                .product-image { width: 100%; height: 100%; object-fit: cover; }
                
                .product-details { padding: 15px; display: flex; flex-direction: column; flex: 1; }
                .product-category { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px; }
                .product-details h3 { font-size: 1rem; margin-bottom: 8px; line-height: 1.4; flex: 1; }
                
                .product-specs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 15px; }
                .spec-badge { font-size: 0.7rem; background: var(--bg-main); padding: 2px 6px; border-radius: 4px; color: var(--text-muted); border: 1px solid var(--border); }

                .product-footer { display: flex; justifyContent: space-between; alignItems: center; margin-top: auto; }
                .product-price { font-weight: bold; font-size: 1.1rem; }
                .btn-add { background: var(--primary); color: white; border: none; padding: 8px 14px; border-radius: 20px; cursor: pointer; display: flex; alignItems: center; gap: 6px; font-size: 0.85rem; }
                
                .mobile-filter-toggle { display: none; margin-bottom: 20px; width: 100%; padding: 12px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; cursor: pointer; align-items: center; justify-content: center; gap: 8px; font-weight: 500; }

                @media (max-width: 900px) {
                    .shop-sidebar { position: fixed; top: 0; left: 0; height: 100vh; width: 280px; background: var(--bg-main); z-index: 1000; padding: 20px; transform: translateX(-100%); transition: transform 0.3s; border-right: 1px solid var(--border); overflow-y: auto; }
                    .shop-sidebar-open { transform: translateX(0); }
                    .mobile-filter-toggle { display: flex; }
                    .shop-sidebar-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                }
            `}</style>
        </div>
    );
};

export default Shop;

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
