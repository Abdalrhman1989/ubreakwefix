import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingBag, ArrowLeft, Check, Truck } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { t } = useLanguage();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="container" style={{ padding: '50px' }}>{t('shop.loadingProduct')}</div>;
    if (!product) return <div className="container" style={{ padding: '50px' }}>{t('shop.notFound')}</div>;

    const seoTitle = t('seo.shop.productTitle').replace('{product}', product.name);
    const seoDesc = t('seo.shop.productDesc')
        .replace('{product}', product.name)
        .replace('{desc}', product.description?.substring(0, 100) || '')
        .replace('{price}', product.price);

    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.image_url,
        "description": product.description,
        "sku": product.id,
        "brand": {
            "@type": "Brand",
            "name": product.specs?.brand || "UBreak WeFix"
        },
        "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "DKK",
            "price": product.price,
            "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/RefurbishedCondition"
        }
    };

    return (
        <div className="container" style={{ padding: '60px 20px', minHeight: '80vh' }}>
            <Helmet>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDesc} />
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            </Helmet>
            <button
                onClick={() => navigate('/shop')}
                style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '30px'
                }}
            >
                <ArrowLeft size={18} /> {t('shop.backToShop')}
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
                {/* Image */}
                <div style={{
                    background: '#f5f5f7',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px',
                    height: '500px'
                }}>
                    <img
                        src={product.image_url}
                        alt={product.name}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
                    />
                </div>

                {/* Details */}
                <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px' }}>
                        {product.category}
                    </div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '15px', color: 'var(--text-main)', lineHeight: '1.2' }}>
                        {product.name}
                    </h1>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        {product.condition && (
                            <span style={{ fontSize: '0.9rem', padding: '6px 12px', borderRadius: '6px', background: '#e0f2fe', color: '#0369a1', fontWeight: '600' }}>
                                {product.condition}
                            </span>
                        )}
                        {product.storage && (
                            <span style={{ fontSize: '0.9rem', padding: '6px 12px', borderRadius: '6px', background: '#f3f4f6', color: '#374151', fontWeight: '600' }}>
                                {product.storage}
                            </span>
                        )}
                        {product.color && (
                            <span style={{ fontSize: '0.9rem', padding: '6px 12px', borderRadius: '6px', background: '#f3f4f6', color: '#374151', fontWeight: '600' }}>
                                {product.color}
                            </span>
                        )}
                    </div>

                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '30px' }}>
                        {(user && user.role === 'business') ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.5rem' }}>
                                    {product.price.toFixed(0)} DKK
                                </span>
                                <span style={{ color: 'var(--primary)' }}>
                                    {(product.price * 0.8).toFixed(0)} DKK
                                </span>
                                <span style={{ fontSize: '0.9rem', background: 'var(--primary)', color: 'white', padding: '4px 8px', borderRadius: '4px' }}>
                                    Business -20%
                                </span>
                            </div>
                        ) : (
                            `${product.price.toFixed(0)} DKK`
                        )}
                    </div>

                    <div style={{ marginBottom: '30px', lineHeight: '1.6', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        {product.description}
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#10b981' }}>
                            <Check size={18} /> <span>{t('shop.inStock')}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                            <Truck size={18} /> <span>{t('shop.freeShipping')}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => addToCart(product)}
                        className="btn-primary"
                        style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '12px',
                            fontSize: '1.1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <ShoppingBag size={20} /> {t('shop.addToCart')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
