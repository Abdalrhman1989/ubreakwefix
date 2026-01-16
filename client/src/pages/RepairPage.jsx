import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import Stepper from '../components/Stepper';
import { Check, Smartphone, Battery, Zap, ChevronRight, Speaker, Mic } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const RepairPage = () => {
    const { modelId } = useParams();
    const navigate = useNavigate();
    const { addToCart, cart, getCartTotal } = useCart();
    const { t } = useLanguage();

    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [repairs, setRepairs] = useState([]);

    // Icon mapper based on name
    const getIcon = (name) => {
        const n = name.toLowerCase();
        if (n.includes('skærm')) return <Smartphone />;
        if (n.includes('batteri')) return <Battery />;
        if (n.includes('ladestik')) return <Zap />;
        if (n.includes('højtaler')) return <Speaker />;
        return <Mic />;
    };

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/models/${modelId}`)
            .then(res => {
                if (res.data) setModel(res.data);
                else setError(true);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));

        axios.get(`/api/models/${modelId}/repairs`)
            .then(res => setRepairs(res.data))
            .catch(err => console.error(err));
    }, [modelId]);

    const handleAdd = (repair) => {
        addToCart({
            uniqueId: Date.now() + Math.random(),
            id: repair.id,
            modelId: model.id,
            modelName: `${model.brand_name} ${model.name}`,
            repairName: repair.name,
            price: repair.price
        });
    };

    if (loading) return <div className="container" style={{ padding: '100px' }}>Loading...</div>;

    if (error || !model) return (
        <div className="container" style={{ padding: '100px', textAlign: 'center' }}>
            <Helmet>
                <title>Model ikke fundet | UBreak WeFix</title>
                <meta name="robots" content="noindex, follow" />
            </Helmet>
            <h2>Model ikke fundet</h2>
            <Link to="/reparationer" className="btn btn-primary" style={{ marginTop: '20px', textDecoration: 'none' }}>
                Gå til oversigt
            </Link>
        </div>
    );

    const seoTitle = model ? t('seo.repairPage.title').replace('{model}', `${model.brand_name} ${model.name}`) : '';
    const seoDesc = model ? t('seo.repairPage.desc').replace('{model}', `${model.brand_name} ${model.name}`) : '';
    const canonicalUrl = model ? `https://ubreakwefix.dk/reparation/${model.id}` : '';

    const structuredData = model ? {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `${model.brand_name} ${model.name}`,
        "image": model.image,
        "description": seoDesc,
        "brand": {
            "@type": "Brand",
            "name": model.brand_name
        },
        "offers": repairs.map(r => ({
            "@type": "Offer",
            "name": r.name,
            "price": r.price,
            "priceCurrency": "DKK",
            "availability": "https://schema.org/InStock"
        }))
    } : null;

    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '100vh', paddingBottom: '100px' }}>
            {model && (
                <Helmet>
                    <title>{seoTitle}</title>
                    <meta name="description" content={seoDesc} />
                    <link rel="canonical" href={canonicalUrl} />
                    <script type="application/ld+json">
                        {JSON.stringify(structuredData)}
                    </script>
                </Helmet>
            )}

            <div className="container" style={{ paddingTop: '40px' }}>
                <Stepper currentStep={2} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                    <Link
                        to={`/reparationer?brand=${model.brand_slug || model.brand_id}`}
                        style={{
                            background: 'var(--bg-element)', border: '1px solid var(--border-light)',
                            padding: '10px 15px', borderRadius: '50%', cursor: 'pointer',
                            color: 'var(--text-main)', fontSize: '1.2rem', textDecoration: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        ←
                    </Link>
                    <div style={{ background: 'white', padding: '10px', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                        <img src={model.image || "https://placehold.co/100x100"} style={{ width: '60px', height: '80px', objectFit: 'contain' }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-main)' }}>{model.brand_name} {model.name}</h1>
                        <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Smartphone - {t('nav.repairs')}</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', alignItems: 'start' }}>

                    {/* LEFT: REPAIRS LIST */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {repairs.map(repair => (
                            <div key={repair.id} className="card-glass" style={{ padding: '24px', background: 'var(--bg-surface)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <div style={{ color: 'var(--text-muted)' }}>{getIcon(repair.name)}</div>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{repair.name}</h3>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', marginTop: '4px' }}>60 MINUTTER</div>
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', padding: '5px 10px', borderRadius: '6px', fontWeight: 'bold' }}>
                                        kr {repair.price}
                                    </div>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                                    {repair.description || "Professionel reparation med garanti. Original kvalitet."}
                                </p>
                                <button onClick={() => handleAdd(repair)} className="btn btn-outline" style={{ width: '100%', borderRadius: '8px' }}>
                                    Vælg reparation
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: SIDEBAR (Sticky) */}
                    <div>
                        <div style={{ background: 'var(--bg-surface)', padding: '30px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', position: 'sticky', top: '100px', border: '1px solid var(--border-light)' }}>
                            <h3 style={{ color: 'var(--primary)', marginBottom: '20px', fontSize: '1.3rem' }}>Oversigt</h3>
                            <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '15px', marginBottom: '15px', color: 'var(--text-main)', fontWeight: '600' }}>
                                {model.brand_name} {model.name}
                            </div>

                            {cart.length === 0 ? (
                                <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '20px', textAlign: 'center', padding: '20px 0' }}>Ingen valgte reparationer</div>
                            ) : (
                                cart.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                        <span>{item.repairName}</span>
                                        <span style={{ fontWeight: 'bold' }}>kr {item.price}</span>
                                    </div>
                                ))
                            )}

                            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', marginTop: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)' }}>
                                    <span>Subtotal</span>
                                    <span>-</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px', color: 'var(--text-main)' }}>
                                    <span>Totalt</span>
                                    <span>kr {getCartTotal()}</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px' }}>inkl. moms (25%)</div>

                                <button onClick={() => navigate('/checkout')} className="btn btn-primary" style={{ width: '100%', height: '56px', fontSize: '1.1rem', borderRadius: '12px' }}>
                                    Gå til kassen
                                </button>

                                <button
                                    onClick={() => {
                                        const deviceModel = `${model.brand_name} ${model.name}`;
                                        const problemUpdates = cart.map(c => c.repairName).join(', ');
                                        navigate('/book', {
                                            state: {
                                                deviceModel: deviceModel,
                                                problem: problemUpdates ? `Valgte reparationer: ${problemUpdates}` : ''
                                            }
                                        });
                                    }}
                                    className="btn"
                                    style={{
                                        width: '100%', height: '56px', fontSize: '1.1rem', borderRadius: '12px',
                                        marginTop: '15px', background: 'var(--bg-element)', border: '1px solid var(--border-light)',
                                        color: 'var(--text-main)', fontWeight: '600'
                                    }}
                                >
                                    📅 Book Tid i Butik
                                </button>

                                <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    Betal i butikken efter reparation
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
};

export default RepairPage;
