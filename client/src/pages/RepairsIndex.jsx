import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Smartphone, Tablet } from 'lucide-react';
import SearchBox from '../components/SearchBox';
import { useLanguage } from '../context/LanguageContext';

const RepairsIndex = () => {
    const { t } = useLanguage();
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [models, setModels] = useState([]);
    const navigate = useNavigate();

    // Specific brand list order
    const priorityBrands = ['Apple', 'Samsung', 'OnePlus', 'Google', 'Huawei', 'LG', 'Motorola', 'Oppo', 'Realme', 'Xiaomi'];

    useEffect(() => {
        axios.get('/api/brands')
            .then(res => {
                const sorted = res.data.sort((a, b) => {
                    const idxA = priorityBrands.indexOf(a.name);
                    const idxB = priorityBrands.indexOf(b.name);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                    return a.name.localeCompare(b.name);
                });
                setBrands(sorted);
            })
            .catch(err => console.error(err));
    }, []);

    const fetchModels = (brand) => {
        setSelectedBrand(brand);
        axios.get(`/api/brands/${brand.id}/models`)
            .then(res => setModels(res.data))
            .catch(err => console.error(err));
    };

    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '100vh', padding: '40px 0' }}>
            <div className="container">

                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: 'var(--text-main)' }}>
                        {selectedBrand ? `Vælg din ${selectedBrand.name} model` : 'Vælg din enhed'}
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px' }}>
                        Vi reparerer alle store mærker og modeller. Vælg din enhed for at se priser.
                    </p>
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <SearchBox />
                    </div>
                </div>

                {/* Back Button (Only when brand selected) */}
                {selectedBrand && (
                    <button
                        onClick={() => { setSelectedBrand(null); setModels([]); }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'none', border: 'none',
                            color: 'var(--primary)', cursor: 'pointer',
                            marginBottom: '20px', fontSize: '1.1rem', fontWeight: 'bold'
                        }}
                    >
                        <ArrowLeft size={20} /> Tilbage til mærker
                    </button>
                )}

                {/* Content Grid */}
                {!selectedBrand ? (
                    // BRANDS GRID
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px' }}>
                        {brands.map(brand => (
                            <div
                                key={brand.id}
                                onClick={() => fetchModels(brand)}
                                className="card-glass"
                                style={{
                                    padding: '40px 20px',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    height: '200px',
                                    background: 'var(--bg-surface)'
                                }}
                            >
                                <img
                                    src={brand.image || `https://placehold.co/100x50?text=${brand.name}`}
                                    alt={brand.name}
                                    className="brand-logo"
                                    onClick={(e) => { e.stopPropagation(); fetchModels(brand); }}
                                />
                                <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '1.2rem' }}>{brand.name}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    // MODELS GRID
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                        {models.length > 0 ? models.map(model => (
                            <div
                                key={model.id}
                                onClick={() => navigate(`/reparation/${model.id}`)}
                                className="card-glass"
                                style={{
                                    padding: '20px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    background: 'var(--bg-surface)'
                                }}
                            >
                                <div style={{
                                    width: '80px', height: '100px',
                                    background: 'var(--bg-element)',
                                    borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '15px'
                                }}>
                                    <Smartphone size={40} color="var(--text-muted)" strokeWidth={1.5} />
                                </div>
                                <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '5px' }}>{model.name}</h3>
                                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>Se reparationer</div>
                            </div>
                        )) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                Ingen modeller fundet for dette mærke.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RepairsIndex;
