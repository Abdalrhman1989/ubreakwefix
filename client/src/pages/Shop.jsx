import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Filter, ChevronDown, ChevronRight, X, Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Shop = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    const [filters, setFilters] = useState({
        categoryId: null,
        searchTerm: '',
        brands: [],
        features: []
    });

    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    axios.get('/api/categories'),
                    axios.get('/api/products')
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

    const getDescendantIds = (catId) => {
        let ids = [catId];
        const children = categories.filter(c => c.parent_id === catId);
        children.forEach(child => {
            ids = [...ids, ...getDescendantIds(child.id)];
        });
        return ids;
    };

    useEffect(() => {
        let result = [...allProducts];

        if (filters.categoryId) {
            const familyIds = getDescendantIds(filters.categoryId);
            result = result.filter(p => familyIds.includes(p.category_id));
        }

        if (filters.searchTerm) {
            const lower = filters.searchTerm.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(lower) ||
                p.description?.toLowerCase().includes(lower)
            );
        }

        if (filters.brands.length > 0) {
            result = result.filter(p => filters.brands.includes(p.specs?.brand));
        }

        if (filters.features.length > 0) {
            result = result.filter(p =>
                p.specs?.features?.some(f => filters.features.includes(f))
            );
        }

        setProducts(result);
    }, [filters, allProducts, categories]);

    const availableOptions = useMemo(() => {
        let currentSet = allProducts;
        if (filters.categoryId) {
            const familyIds = getDescendantIds(filters.categoryId);
            currentSet = currentSet.filter(p => familyIds.includes(p.category_id));
        }

        const brands = [...new Set(currentSet.map(p => p.specs?.brand).filter(Boolean))].sort();
        const features = [...new Set(currentSet.flatMap(p => p.specs?.features || []))].sort();

        return { brands, features };
    }, [allProducts, filters.categoryId]);

    const toggleBrand = (brand) => {
        setFilters(prev => ({
            ...prev,
            brands: prev.brands.includes(brand) ? prev.brands.filter(b => b !== brand) : [...prev.brands, brand]
        }));
    };

    const toggleFeature = (feature) => {
        setFilters(prev => ({
            ...prev,
            features: prev.features.includes(feature) ? prev.features.filter(f => f !== feature) : [...prev.features, feature]
        }));
    };

    const clearFilters = () => setFilters(prev => ({ ...prev, brands: [], features: [] }));

    const CategoryItem = ({ cat }) => {
        const children = categories.filter(c => c.parent_id === cat.id);
        const isOpen = filters.categoryId === cat.id || getDescendantIds(cat.id).includes(filters.categoryId);
        const isSelected = filters.categoryId === cat.id;
        const [expanded, setExpanded] = useState(isOpen);

        return (
            <div className="category-item">
                <div className="cat-header">
                    <button
                        onClick={() => setFilters(prev => ({ ...prev, categoryId: cat.id }))}
                        className={`cat-link ${isSelected ? 'active' : ''}`}
                    >
                        {cat.name}
                    </button>
                    {children.length > 0 && (
                        <button onClick={() => setExpanded(!expanded)} className="cat-expand">
                            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                    )}
                </div>
                {children.length > 0 && expanded && (
                    <div className="cat-children">
                        {children.map(child => <CategoryItem key={child.id} cat={child} />)}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="shop-page">
            <div className="shop-container">
                {/* Header Section */}
                <div className="shop-header">
                    <div className="header-left">
                        <h1>Shop</h1>
                        <span className="product-count">{products.length} Products</span>
                    </div>

                    <div className="shop-search">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={filters.searchTerm}
                            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                        />
                    </div>
                </div>

                {/* Mobile Filter Toggle */}
                <button className="mobile-filter-btn" onClick={() => setSidebarOpen(true)}>
                    <Filter size={18} /> Show Filters
                </button>

                {/* Active Filters Badge */}
                {filters.categoryId && (
                    <div className="active-filter-badge">
                        Category: {categories.find(c => c.id === filters.categoryId)?.name}
                        <button onClick={() => setFilters(prev => ({ ...prev, categoryId: null }))}><X size={12} /></button>
                    </div>
                )}

                <div className="shop-layout">
                    {/* Sidebar */}
                    <aside className={`shop-sidebar ${sidebarOpen ? 'open' : ''}`}>
                        <div className="sidebar-header-mobile">
                            <h3>Filters</h3>
                            <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
                        </div>

                        <div className="filter-group">
                            <h4>Categories</h4>
                            <nav className="category-nav">
                                <button
                                    className={`cat-link ${!filters.categoryId ? 'active' : ''}`}
                                    onClick={() => setFilters(prev => ({ ...prev, categoryId: null }))}
                                >
                                    All Categories
                                </button>
                                {categories.filter(c => !c.parent_id).map(cat => (
                                    <CategoryItem key={cat.id} cat={cat} />
                                ))}
                            </nav>
                        </div>

                        <div className="filter-group">
                            <h4>Brands</h4>
                            {availableOptions.brands.length === 0 ? <span className="empty-msg">No brands</span> : (
                                <div className="checkbox-list">
                                    {availableOptions.brands.map(brand => (
                                        <label key={brand} className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                checked={filters.brands.includes(brand)}
                                                onChange={() => toggleBrand(brand)}
                                            />
                                            <span className="checkmark"></span>
                                            <span className="label-text">{brand}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="filter-group">
                            <h4>Features</h4>
                            {availableOptions.features.length === 0 ? <span className="empty-msg">No features</span> : (
                                <div className="checkbox-list">
                                    {availableOptions.features.map(feature => (
                                        <label key={feature} className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                checked={filters.features.includes(feature)}
                                                onChange={() => toggleFeature(feature)}
                                            />
                                            <span className="checkmark"></span>
                                            <span className="label-text">{feature}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {(filters.brands.length > 0 || filters.features.length > 0) && (
                            <button onClick={clearFilters} className="clear-filters-btn">Clear All Filters</button>
                        )}
                    </aside>

                    {/* Overlay */}
                    {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

                    {/* Product Grid */}
                    <main className="shop-main">
                        {loading ? (
                            <div className="loading-state">Loading products...</div>
                        ) : products.length === 0 ? (
                            <div className="empty-state">
                                <ShoppingBag size={48} />
                                <p>No products found matching your criteria.</p>
                                <button onClick={clearFilters}>Clear Filters</button>
                            </div>
                        ) : (
                            <div className="products-grid">
                                {products.map(product => (
                                    <div key={product.id} className="product-card group">
                                        <div className="card-image-wrapper">
                                            <Link to={`/shop/product/${product.id}`}>
                                                <img src={product.image_url} alt={product.name} loading="lazy" />
                                            </Link>
                                            {product.stock_quantity < 5 && product.stock_quantity > 0 && (
                                                <span className="badge badge-low-stock">Low Stock</span>
                                            )}
                                            {product.stock_quantity === 0 && (
                                                <span className="badge badge-out">Sold Out</span>
                                            )}
                                        </div>

                                        <div className="card-content">
                                            <div className="card-meta">
                                                <span className="category-tag">
                                                    {categories.find(c => c.id === product.category_id)?.name || 'Accessory'}
                                                </span>
                                                {product.specs?.brand && <span className="brand-tag">{product.specs.brand}</span>}
                                            </div>

                                            <Link to={`/shop/product/${product.id}`} className="product-title">
                                                <h3>{product.name}</h3>
                                            </Link>

                                            <div className="card-footer">
                                                <div className="price-wrapper">
                                                    <span className="price">{product.price} DKK</span>
                                                </div>
                                                <button
                                                    onClick={() => addToCart(product)}
                                                    className="add-btn"
                                                    disabled={product.stock_quantity === 0}
                                                >
                                                    <ShoppingBag size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <style>{`
                /* Modern Variables */
                :root {
                    --shop-bg: #F9FAFB;
                    --card-bg: #FFFFFF;
                    --primary: #2563EB;
                    --primary-dark: #1D4ED8;
                    --text-primary: #111827;
                    --text-secondary: #6B7280;
                    --border: #E5E7EB;
                    --radius-lg: 16px;
                    --radius-md: 12px;
                    --radius-sm: 8px;
                    --shadow-sm: 0 1px 3px rgba(0,0,0,0.05);
                    --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.05);
                    --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.05);
                    --shadow-hover: 0 20px 25px -5px rgba(0,0,0,0.08);
                }

                .shop-page {
                    background-color: var(--shop-bg);
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif;
                }

                .shop-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 40px 24px;
                }

                /* Header */
                .shop-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                    flex-wrap: wrap;
                    gap: 16px;
                }

                .header-left h1 {
                    font-size: 2.25rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    margin: 0;
                    letter-spacing: -0.025em;
                }

                .product-count {
                    color: var(--text-secondary);
                    font-size: 0.95rem;
                    margin-top: 4px;
                    display: block;
                }

                .shop-search {
                    position: relative;
                    min-width: 300px;
                }

                .shop-search input {
                    width: 100%;
                    padding: 12px 16px 12px 42px;
                    border: 1px solid var(--border);
                    border-radius: 50px;
                    background: white;
                    font-size: 0.95rem;
                    transition: all 0.2s;
                    box-shadow: var(--shadow-sm);
                }

                .shop-search input:focus {
                    outline: none;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                }

                .search-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-secondary);
                }

                /* Layout */
                .shop-layout {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 40px;
                    align-items: start;
                }

                /* Sidebar */
                .shop-sidebar {
                    background: white;
                    padding: 24px;
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border);
                    position: sticky;
                    top: 24px;
                    max-height: calc(100vh - 48px);
                    overflow-y: auto;
                    box-shadow: var(--shadow-sm);
                }

                .filter-group {
                    margin-bottom: 32px;
                }

                .filter-group:last-child {
                    margin-bottom: 0;
                }

                .filter-group h4 {
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--text-secondary);
                    font-weight: 700;
                    margin-bottom: 16px;
                }

                /* Category Nav */
                .category-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .cat-link {
                    background: none;
                    border: none;
                    text-align: left;
                    font-size: 0.95rem;
                    color: var(--text-primary);
                    padding: 6px 0;
                    cursor: pointer;
                    transition: color 0.15s;
                }

                .cat-link:hover, .cat-link.active {
                    color: var(--primary);
                    font-weight: 500;
                }

                .cat-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .cat-expand {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 4px;
                }

                .cat-children {
                    margin-left: 12px;
                    padding-left: 12px;
                    border-left: 2px solid #F3F4F6;
                    margin-top: 4px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                /* Checkboxes */
                .checkbox-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .checkbox-item {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    font-size: 0.95rem;
                    color: var(--text-primary);
                    user-select: none;
                }

                .checkbox-item input {
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;
                    height: 0;
                    width: 0;
                }

                .checkmark {
                    height: 18px;
                    width: 18px;
                    background-color: white;
                    border: 2px solid var(--border);
                    border-radius: 4px;
                    margin-right: 10px;
                    transition: all 0.2s;
                    position: relative;
                }

                .checkbox-item:hover input ~ .checkmark {
                    border-color: var(--primary);
                }

                .checkbox-item input:checked ~ .checkmark {
                    background-color: var(--primary);
                    border-color: var(--primary);
                }

                .checkmark:after {
                    content: "";
                    position: absolute;
                    display: none;
                    left: 5px;
                    top: 2px;
                    width: 4px;
                    height: 9px;
                    border: solid white;
                    border-width: 0 2px 2px 0;
                    transform: rotate(45deg);
                }

                .checkbox-item input:checked ~ .checkmark:after {
                    display: block;
                }

                .clear-filters-btn {
                    width: 100%;
                    padding: 10px;
                    background: #F3F4F6;
                    border: none;
                    border-radius: var(--radius-sm);
                    color: var(--text-secondary);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-top: 10px;
                }

                .clear-filters-btn:hover {
                    background: #E5E7EB;
                    color: var(--text-primary);
                }

                /* Product Grid */
                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                    gap: 24px;
                }

                .product-card {
                    background: var(--card-bg);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }

                .product-card:hover {
                    transform: translateY(-6px);
                    box-shadow: var(--shadow-hover);
                    border-color: var(--primary);
                }

                .card-image-wrapper {
                    aspect-ratio: 1;
                    padding: 24px;
                    background: #F8FAFC;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                }

                .card-image-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    transition: transform 0.5s ease;
                    mix-blend-mode: multiply;
                }

                .product-card:hover .card-image-wrapper img {
                    transform: scale(1.08);
                }

                .badge {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .badge-low-stock {
                    background: #FEF3C7;
                    color: #D97706;
                }

                .badge-out {
                    background: #FEE2E2;
                    color: #DC2626;
                }

                .card-content {
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    gap: 8px;
                }

                .card-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.75rem;
                }

                .category-tag {
                    color: var(--text-secondary);
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .brand-tag {
                    background: #F3F4F6;
                    padding: 2px 8px;
                    border-radius: 4px;
                    color: var(--text-secondary);
                    font-weight: 500;
                }

                .product-title {
                    text-decoration: none;
                    color: var(--text-primary);
                }

                .product-title h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    line-height: 1.4;
                    font-weight: 700;
                    transition: color 0.2s;
                }

                .product-title:hover h3 {
                    color: var(--primary);
                }

                .card-footer {
                    margin-top: auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 16px;
                }

                .price {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: var(--text-primary);
                }

                .add-btn {
                    background: var(--primary);
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
                }

                .add-btn:hover:not(:disabled) {
                    background: var(--primary-dark);
                    transform: scale(1.05);
                }

                .add-btn:disabled {
                    background: #E5E7EB;
                    cursor: not-allowed;
                    box-shadow: none;
                }

                /* Mobile Toggle */
                .mobile-filter-btn {
                    display: none;
                    width: 100%;
                    padding: 14px;
                    background: white;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    font-weight: 600;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-bottom: 24px;
                    cursor: pointer;
                    color: var(--text-primary);
                    box-shadow: var(--shadow-sm);
                }

                .active-filter-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #DBEAFE;
                    color: #1E40AF;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    margin-bottom: 24px;
                }

                .active-filter-badge button {
                    background: none;
                    border: none;
                    color: inherit;
                    cursor: pointer;
                    display: flex;
                    padding: 0;
                }

                /* Mobile Sidebar Transition */
                .sidebar-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 999;
                    backdrop-filter: blur(2px);
                }

                .sidebar-header-mobile {
                    display: none;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid var(--border);
                }
                
                .empty-state {
                    text-align: center;
                    padding: 60px 0;
                    color: var(--text-secondary);
                }
                
                .empty-state svg {
                    margin-bottom: 16px;
                    color: var(--border);
                }
                
                .empty-state button {
                    margin-top: 16px;
                    padding: 8px 16px;
                    background: none;
                    border: 1px solid var(--border);
                    border-radius: 6px;
                    cursor: pointer;
                }

                /* Responsive Breakpoints */
                @media (max-width: 1024px) {
                    .shop-layout {
                        display: block;
                    }

                    .shop-sidebar {
                        position: fixed;
                        top: 0;
                        left: 0;
                        height: 100vh;
                        width: 320px;
                        z-index: 1000;
                        transform: translateX(-100%);
                        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        border-radius: 0;
                        border: none;
                        max-height: none;
                    }

                    .shop-sidebar.open {
                        transform: translateX(0);
                    }

                    .mobile-filter-btn {
                        display: flex;
                    }

                    .sidebar-header-mobile {
                        display: flex;
                    }
                    
                    .products-grid {
                         grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    }
                }

                @media (max-width: 640px) {
                    .shop-container {
                        padding: 24px 16px;
                    }
                    
                    .shop-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }
                    
                    .shop-search {
                        width: 100%;
                    }

                    .products-grid {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                    
                    .product-card {
                        flex-direction: row;
                        height: 140px;
                    }
                    
                    .card-image-wrapper {
                        width: 120px;
                        height: 100%;
                        padding: 12px;
                    }
                    
                    .card-content {
                        padding: 16px;
                    }
                    
                    .product-title h3 {
                        font-size: 1rem;
                    }
                    
                    .price {
                        font-size: 1.1rem;
                    }
                    
                    .add-btn {
                        width: 36px;
                        height: 36px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Shop;
