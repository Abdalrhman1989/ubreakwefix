import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Filter, ChevronDown, ChevronRight, X, Heart } from 'lucide-react';
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
                            placeholder="Search products..."
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

                                            {/* Status Badges */}
                                            {product.stock_quantity === 0 ? (
                                                <span className="badge badge-error">Sold Out</span>
                                            ) : product.stock_quantity < 5 ? (
                                                <span className="badge badge-warning">Low Stock</span>
                                            ) : product.specs?.brand ? (
                                                <span className="badge badge-neutral">{product.specs.brand}</span>
                                            ) : null}

                                            {/* Hover Action */}
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="quick-add-btn"
                                                disabled={product.stock_quantity === 0}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>

                                        <div className="card-content">
                                            <div className="card-meta">
                                                <span className="category-tag">
                                                    {categories.find(c => c.id === product.category_id)?.name || 'Accessory'}
                                                </span>
                                            </div>

                                            <Link to={`/shop/product/${product.id}`} className="product-title">
                                                <h3>{product.name}</h3>
                                            </Link>

                                            <div className="card-footer">
                                                <span className="price">{product.price} DKK</span>
                                                <button className="heart-btn"><Heart size={18} /></button>
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
                /* Uses Global Variables from index.css for Dark Mode Support */
                
                .shop-page {
                    background-color: var(--bg-body);
                    min-height: 100vh;
                    padding-bottom: 60px;
                }

                .shop-container {
                    max-width: var(--container-width);
                    margin: 0 auto;
                    padding: 40px 24px;
                }

                /* Header */
                .shop-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 32px;
                    gap: 20px;
                    flex-wrap: wrap;
                }

                .header-left h1 {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin: 0;
                    color: var(--text-main);
                    line-height: 1.1;
                }

                .product-count {
                    color: var(--text-muted);
                    font-size: 0.9rem;
                    margin-top: 8px;
                    display: block;
                    font-weight: 500;
                }

                .shop-search {
                    position: relative;
                    min-width: 320px;
                    flex-shrink: 0;
                }

                .shop-search input {
                    width: 100%;
                    padding: 14px 16px 14px 48px;
                    border: 1px solid var(--border-light);
                    border-radius: 50px;
                    background: var(--bg-surface);
                    color: var(--text-main);
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                    box-shadow: var(--shadow-sm);
                }

                .shop-search input:focus {
                    outline: none;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                }

                .search-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                }

                /* Layout */
                .shop-layout {
                    display: grid;
                    grid-template-columns: 260px 1fr;
                    gap: 40px;
                    align-items: start;
                }

                /* Sidebar */
                .shop-sidebar {
                    position: sticky;
                    top: 24px;
                    padding-right: 10px;
                }

                .filter-group {
                    margin-bottom: 32px;
                }

                .filter-group h4 {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--text-muted);
                    margin-bottom: 16px;
                    font-weight: 700;
                }

                /* Category Nav */
                .category-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .cat-link {
                    background: none;
                    border: none;
                    text-align: left;
                    font-size: 0.95rem;
                    color: var(--text-main);
                    padding: 6px 0;
                    cursor: pointer;
                    transition: color 0.2s;
                    font-family: inherit;
                }

                .cat-link:hover, .cat-link.active {
                    color: var(--primary);
                    font-weight: 600;
                }

                .cat-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .cat-expand {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 4px;
                }

                .cat-children {
                    margin-left: 12px;
                    padding-left: 12px;
                    border-left: 1px solid var(--border-light);
                    margin-top: 4px;
                    display: flex;
                    flex-direction: column;
                }

                /* Checkboxes */
                .checkbox-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .checkbox-item {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    font-size: 0.95rem;
                    color: var(--text-main);
                    user-select: none;
                    position: relative;
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
                    background-color: transparent;
                    border: 1.5px solid var(--border-medium);
                    border-radius: 4px;
                    margin-right: 12px;
                    transition: all 0.2s;
                    position: relative;
                    flex-shrink: 0;
                }

                .checkbox-item:hover .checkmark {
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
                    top: 1px;
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
                    background: var(--bg-element);
                    border: none;
                    border-radius: var(--radius-md);
                    color: var(--text-muted);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-top: 10px;
                    font-size: 0.9rem;
                }

                .clear-filters-btn:hover {
                    background: var(--border-light);
                    color: var(--text-main);
                }

                /* Products */
                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 32px;
                }

                .product-card {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    group: 1; /* For group utilities approximation */
                }

                .card-image-wrapper {
                    background: var(--bg-surface);
                    border-radius: var(--radius-lg);
                    aspect-ratio: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 32px;
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    border: 1px solid transparent;
                }
                
                /* Dark Mode Border fix for cards */
                [data-theme='dark'] .card-image-wrapper {
                    border-color: var(--border-light);
                    background: var(--bg-element);
                }

                .product-card:hover .card-image-wrapper {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-lg);
                }

                .card-image-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    transition: transform 0.5s ease;
                    /* In Dark Mode, images (often black) need invert or brightness adjustment? */
                    /* Assuming transparent PNGs, might look odd on dark if black product. 
                       Mix-blend-mode multiply works best on light. 
                       For dark, we might need a subtle white glow or just normal blending. */
                    mix-blend-mode: normal; 
                }

                .product-card:hover .card-image-wrapper img {
                    transform: scale(1.08);
                }

                /* Quick Add Button - Appears on Hover */
                .quick-add-btn {
                    position: absolute;
                    bottom: 16px;
                    left: 50%;
                    transform: translateX(-50%) translateY(20px);
                    background: var(--text-main); /* Black on light, White on dark */
                    color: var(--bg-body);
                    border: none;
                    padding: 10px 24px;
                    border-radius: 30px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    opacity: 0;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                    white-space: nowrap;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }

                .product-card:hover .quick-add-btn {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }

                .quick-add-btn:hover {
                    background: var(--primary);
                    color: white;
                }

                .badge {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .badge-neutral { background: var(--bg-element); color: var(--text-secondary); }
                .badge-warning { background: #FEF3C7; color: #D97706; }
                .badge-error { background: #FEE2E2; color: #DC2626; }

                .card-content {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .category-tag {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                .product-title h3 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--text-main);
                    margin: 0;
                    line-height: 1.4;
                    transition: color 0.2s;
                }

                .product-title:hover h3 {
                    color: var(--primary);
                }

                .product-title { text-decoration: none; }

                .card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 4px;
                }

                .price {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .heart-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 4px;
                    transition: color 0.2s;
                }

                .heart-btn:hover {
                    color: #EF4444;
                }

                /* Mobile Stuff */
                .mobile-filter-btn {
                    display: none;
                    width: 100%;
                    padding: 14px;
                    background: var(--bg-surface);
                    color: var(--text-main);
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-md);
                    font-weight: 600;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-bottom: 24px;
                    cursor: pointer;
                }
                
                .active-filter-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--bg-element);
                    color: var(--text-main);
                    border: 1px solid var(--border-light);
                    padding: 8px 16px;
                    border-radius: 30px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    margin-bottom: 24px;
                }

                .active-filter-badge button {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    display: flex;
                    padding: 0;
                }

                .sidebar-header-mobile {
                    display: none;
                }

                .sidebar-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 99;
                    backdrop-filter: blur(4px);
                }
                
                .loading-state, .empty-state {
                    text-align: center;
                    padding: 60px 0;
                    color: var(--text-muted);
                }

                @media (max-width: 1024px) {
                    .shop-layout {
                        display: block;
                    }
                    .shop-sidebar {
                        position: fixed;
                        top: 0;
                        left: 0;
                        height: 100vh;
                        width: 300px;
                        background: var(--bg-surface);
                        z-index: 1000;
                        padding: 24px;
                        transform: translateX(-100%);
                        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        overflow-y: auto;
                        box-shadow: 20px 0 40px rgba(0,0,0,0.1);
                    }
                    .shop-sidebar.open {
                        transform: translateX(0);
                    }
                    .sidebar-header-mobile {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 24px;
                        color: var(--text-main);
                    }
                    .sidebar-header-mobile button {
                         background: none; border: none; color: var(--text-main); cursor: pointer;
                    }
                    .mobile-filter-btn {
                        display: flex;
                    }
                }
                
                @media (max-width: 640px) {
                    .products-grid {
                         grid-template-columns: 1fr;
                    }
                    .product-card {
                        flex-direction: row;
                        align-items: center;
                        gap: 16px;
                    }
                    .card-image-wrapper {
                        height: 120px;
                        width: 120px;
                        padding: 16px;
                    }
                    .quick-add-btn {
                        display: none; /* Hide on mobile, use a static button if needed or card click */
                    }
                }
            `}</style>
        </div>
    );
};

export default Shop;
